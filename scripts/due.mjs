#!/usr/bin/env node
// Lists what's due today across campaigns, BRAND.md, and context/. Routines call it first and
// act only on what it finds, so date math is done by code, not by guesswork.
//
// Usage:
//   node scripts/due.mjs [--date YYYY-MM-DD] [--only qa|risk|retro|stuck|claims|context] [--json]
//
// Checks:
//   qa       launch is exactly 3 or 1 business days away: run /campaign-qa <slug> recheck
//   risk     launch within 5 business days with a failed gate and no override for it
//   retro    goal date passed after launch, and no retro.md yet
//   stuck    pre-launch stage with no status.md update in 7+ days
//   claims   BRAND.md Approved claims expired, or expiring within 30 days
//   context  quarterly goals ended or ending within 30 days; past rows in the calendar's
//            upcoming launches; tools marked broken in connections.md
//
// Business days are Monday to Friday. Exit code: 0 (the report is informational), 2 on bad usage.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRE_LAUNCH = ['brief', 'plan', 'create', 'review', 'qa'];
const LAUNCHED = ['launch', 'watch', 'retro'];
const GATES = ['cmo', 'brand', 'ops', 'copy', 'compliance', 'qa'];
const CHECKS = ['qa', 'risk', 'retro', 'stuck', 'claims', 'context'];
const DAY_MS = 86_400_000;

// Dates are handled as UTC midnight so weekday math never shifts with the local zone.
export function parseDate(text) {
  const match = /(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(text ?? '');
  if (!match) return null;
  return new Date(Date.UTC(+match[1], +match[2] - 1, match[3] ? +match[3] : 1));
}

const iso = (date) => date.toISOString().slice(0, 10);
const daysBetween = (from, to) => Math.round((to - from) / DAY_MS);

// Weekdays d with from < d <= to. Negative when `to` is in the past.
export function businessDaysUntil(from, to) {
  const sign = to >= from ? 1 : -1;
  const [start, end] = sign > 0 ? [from, to] : [to, from];
  let count = 0;
  for (let t = start.getTime() + DAY_MS; t <= end.getTime(); t += DAY_MS) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) count++;
  }
  return sign * count;
}

const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : null);

// Reads the simple YAML frontmatter campaign status files use.
export function parseStatus(text) {
  const status = { scores: {}, overrides: [] };
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text ?? '');
  if (!block) return status;
  let section = null;
  for (const raw of block[1].split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '');
    const top = /^(\w+):\s*(.*)$/.exec(line);
    if (top) {
      section = top[1];
      if (top[2] && top[2] !== '[]') status[section] = top[2].trim();
      continue;
    }
    const nested = /^\s+(\w+):\s*(.*)$/.exec(line);
    if (section === 'scores' && nested) status.scores[nested[1]] = nested[2].trim();
    const gate = /^\s*-\s*\{.*gate:\s*([\w-]+)/.exec(line);
    if (section === 'overrides' && gate) status.overrides.push(gate[1]);
  }
  return status;
}

function gateFailed(gate, value) {
  if (value === undefined || value === 'null' || value === '') return true;
  if (gate === 'compliance') return value !== 'pass';
  if (gate === 'qa') return Number(value) !== 0;
  return !(Number(value) >= 7);
}

// Rows of the first Markdown table under a heading, as arrays of trimmed cells.
function tableUnder(text, heading) {
  const lines = (text ?? '').split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim().toLowerCase() === heading.toLowerCase());
  if (start < 0) return [];
  const rows = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,6} /.test(line)) break;
    if (!line.trim().startsWith('|')) {
      if (rows.length) break;
      continue;
    }
    if (/^\|[\s|:-]+\|$/.test(line.trim())) continue;
    rows.push(line.trim().slice(1, -1).split('|').map((cell) => cell.trim()));
  }
  return rows.slice(1); // drop the header row
}

function scanCampaigns(today) {
  const dir = path.join(ROOT, 'campaigns');
  const found = [];
  if (!existsSync(dir)) return found;
  for (const slug of readdirSync(dir)) {
    const folder = path.join(dir, slug);
    if (slug.startsWith('_') || !statSync(folder).isDirectory()) continue;
    const status = parseStatus(read(path.join(folder, 'status.md')));
    const stage = status.stage ?? 'brief';
    if (stage === 'done') continue;
    const owner = status.owner ?? 'TBD';
    const launch = parseDate(status.launch_date);
    const updated = parseDate(status.updated);
    const goal = parseDate(/\*\*By:\*\*\s*([^\n]+)/.exec(read(path.join(folder, 'brief.md')) ?? '')?.[1]);
    const base = { slug, stage, owner };

    if (launch && PRE_LAUNCH.includes(stage)) {
      const days = businessDaysUntil(today, launch);
      if (days === 3 || days === 1) {
        found.push({ ...base, check: 'qa', when: iso(launch), detail: `launch in ${days} business day${days === 1 ? '' : 's'}: run /campaign-qa ${slug} recheck` });
      }
      const failed = GATES.filter((g) => gateFailed(g, status.scores[g]) && !status.overrides.includes(g));
      if (days >= 0 && days <= 5 && failed.length) {
        found.push({ ...base, check: 'risk', when: iso(launch), detail: `launch in ${days} business day${days === 1 ? '' : 's'}; not passed: ${failed.map((g) => `${g} (${status.scores[g] ?? 'null'})`).join(', ')}` });
      }
      if (days < 0) {
        found.push({ ...base, check: 'risk', when: iso(launch), detail: `launch date passed ${-days} business days ago and the stage is still ${stage}` });
      }
    }
    if (goal && goal < today && LAUNCHED.includes(stage) && !existsSync(path.join(folder, 'retro.md'))) {
      found.push({ ...base, check: 'retro', when: iso(goal), detail: `goal date passed ${daysBetween(goal, today)} days ago: run /campaign-retro ${slug}` });
    }
    if (updated && PRE_LAUNCH.includes(stage) && daysBetween(updated, today) >= 7) {
      found.push({ ...base, check: 'stuck', when: iso(updated), detail: `no update in ${daysBetween(updated, today)} days at stage ${stage}` });
    }
  }
  return found;
}

function scanClaims(today) {
  const found = [];
  for (const [claim, source, expires] of tableUnder(read(path.join(ROOT, 'BRAND.md')), '## Approved claims')) {
    const date = parseDate(expires);
    if (!claim || claim === 'TBD' || !date) continue;
    const days = daysBetween(today, date);
    if (days < 0) found.push({ check: 'claims', when: iso(date), detail: `expired: "${claim}" (${source}). Copy review will block it.` });
    else if (days <= 30) found.push({ check: 'claims', when: iso(date), detail: `expires in ${days} days: "${claim}" (${source}). Renew the source or retire it.` });
  }
  return found;
}

function scanContext(today) {
  const found = [];
  const company = read(path.join(ROOT, 'context', 'company.md')) ?? '';
  const goals = /## This quarter's marketing goals\r?\n([\s\S]*?)(?:\r?\n## |$)/.exec(company)?.[1] ?? '';
  const goalDates = [...goals.matchAll(/\d{4}-\d{2}-\d{2}/g)].map((m) => parseDate(m[0]));
  if (goalDates.length) {
    const last = new Date(Math.max(...goalDates));
    const days = daysBetween(today, last);
    if (days < 0) found.push({ check: 'context', when: iso(last), detail: 'every quarterly goal in context/company.md has ended. CMO reviews score strategic fit against them: run /onboard-marketing pain.' });
    else if (days <= 30) found.push({ check: 'context', when: iso(last), detail: `quarterly goals end in ${days} days. Set next quarter's with /onboard-marketing pain.` });
  }
  const upcoming = tableUnder(read(path.join(ROOT, 'context', 'calendar.md')), '## Upcoming launches');
  const past = upcoming.filter(([date]) => parseDate(date) && parseDate(date) < today);
  if (past.length) found.push({ check: 'context', when: iso(today), detail: `${past.length} past row(s) still under "Upcoming launches" in context/calendar.md` });
  for (const [tool, , status] of tableUnder(read(path.join(ROOT, 'connections.md')), '## Registry')) {
    if (/^broken/i.test(status ?? '')) found.push({ check: 'context', when: iso(today), detail: `${tool} is ${status} in connections.md` });
  }
  return found;
}

export function scan(today, only) {
  const all = [...scanCampaigns(today), ...scanClaims(today), ...scanContext(today)];
  return only ? all.filter((item) => item.check === only) : all;
}

const TITLES = {
  qa: 'QA countdown', risk: 'At risk', retro: 'Retro due', stuck: 'Stuck',
  claims: 'Approved claims', context: 'Context',
};

function print(today, items) {
  console.log(`Due on ${iso(today)}: ${items.length} item${items.length === 1 ? '' : 's'}`);
  for (const check of CHECKS) {
    const group = items.filter((item) => item.check === check);
    if (!group.length) continue;
    console.log(`\n${TITLES[check]}`);
    for (const item of group) {
      const who = item.slug ? `${item.slug} (${item.owner}): ` : '';
      console.log(`- ${who}${item.detail}`);
    }
  }
}

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) flags[argv[i].slice(2)] = true;
    else flags[argv[i].slice(2)] = argv[++i];
  }
  return flags;
}

function main() {
  const flags = parseArgs(process.argv.slice(2));
  const today = typeof flags.date === 'string' ? parseDate(flags.date) : parseDate(new Date().toLocaleDateString('en-CA'));
  if (!today || (flags.only && !CHECKS.includes(flags.only))) {
    console.error(`Usage: node scripts/due.mjs [--date YYYY-MM-DD] [--only ${CHECKS.join('|')}] [--json]`);
    process.exit(2);
  }
  const items = scan(today, flags.only);
  if (flags.json) console.log(JSON.stringify({ date: iso(today), items }, null, 2));
  else print(today, items);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
