#!/usr/bin/env node
// Builds UTM links and checks them against playbooks/naming-conventions.md.
//
// Usage:
//   node scripts/utm-builder.mjs build --url <url> --source <source> --medium <medium>
//        --campaign <slug> --content <asset-placement> [--term <keyword>]
//   node scripts/utm-builder.mjs check <url> [<url> ...] [--campaign <slug>]
//        [--site <your-domain>] [--type email|page] [--json]
//
// Allowed utm_source and utm_medium values are read from the naming conventions file, so
// adding a value there is enough. Exit code: 0 if clean, 1 if any problem, 2 on bad usage.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONVENTIONS = path.join(ROOT, 'playbooks', 'naming-conventions.md');

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const REQUIRED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

// Used only if the conventions file is missing or its table can't be read.
const DEFAULT_ALLOWED = {
  utm_source: ['hubspot', 'linkedin', 'google', 'meta', 'x', 'youtube', 'partner-<name>'],
  utm_medium: ['email', 'social', 'paid-social', 'cpc', 'display', 'referral', 'event'],
};

const SLUG = /^\d{4}-(0[1-9]|1[0-2])-[a-z0-9]+(-[a-z0-9]+)*$/;
const TOKEN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_LIKE = /\d{4}-\d{2}/;

export const SEVERITY_ORDER = ['Blocker', 'Major', 'Minor', 'Check', 'Info'];

// Reads the "Allowed values" column of the UTM table in naming-conventions.md.
export function loadAllowedValues(file = CONVENTIONS) {
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    return { ...DEFAULT_ALLOWED, fromFile: false };
  }
  const lines = text.split(/\r?\n/);
  const allowed = { fromFile: true };
  for (const key of ['utm_source', 'utm_medium']) {
    const row = lines.find((line) => line.startsWith(`| \`${key}\``));
    const cells = row ? row.split('|') : [];
    const values = cells.length > 3 ? [...cells[3].matchAll(/`([^`]+)`/g)].map((m) => m[1]) : [];
    if (values.length) {
      allowed[key] = values;
    } else {
      allowed[key] = DEFAULT_ALLOWED[key];
      allowed.fromFile = false;
    }
  }
  return allowed;
}

// `partner-<name>` in the conventions means any value starting with `partner-`.
function isAllowed(value, list) {
  return list.some((entry) => {
    const open = entry.indexOf('<');
    if (open === -1) return value === entry;
    const prefix = entry.slice(0, open);
    return value.startsWith(prefix) && TOKEN.test(value.slice(prefix.length));
  });
}

function hostOf(url) {
  return url.hostname.toLowerCase().replace(/^www\./, '');
}

export function isOwnSite(url, site) {
  if (!site) return false;
  const own = site.toLowerCase().replace(/^www\./, '');
  const host = hostOf(url);
  return host === own || host.endsWith(`.${own}`);
}

// Checks the values of whatever UTM parameters are present.
export function checkUtmValues(params, { allowed = loadAllowedValues(), campaign } = {}) {
  const issues = [];
  const add = (severity, param, message) => issues.push({ severity, param, message });

  for (const key of UTM_KEYS) {
    const all = params.getAll(key);
    if (all.length === 0) continue;
    if (all.length > 1) add('Major', key, `appears ${all.length} times; keep one`);
    const value = all[0];

    if (value === '') {
      add('Blocker', key, 'is empty');
      continue;
    }
    if (value !== value.toLowerCase()) add('Major', key, `"${value}" must be lowercase`);
    if (!TOKEN.test(value.toLowerCase()) && key !== 'utm_campaign') {
      add('Major', key, `"${value}" may only use lowercase letters, numbers, and hyphens`);
    }
    if (key !== 'utm_campaign' && DATE_LIKE.test(value)) {
      add('Major', key, `"${value}" contains a date; only utm_campaign may`);
    }
    if ((key === 'utm_source' || key === 'utm_medium') && !isAllowed(value, allowed[key])) {
      add('Major', key, `"${value}" isn't an allowed value (${allowed[key].join(', ')}). ` +
        'Add it to playbooks/naming-conventions.md first if it should be.');
    }
    if (key === 'utm_campaign') {
      if (!SLUG.test(value)) add('Major', key, `"${value}" must be a campaign slug: YYYY-MM-short-name`);
      if (campaign && value !== campaign) add('Blocker', key, `"${value}" doesn't match the campaign "${campaign}"`);
    }
    if (key === 'utm_content' && TOKEN.test(value) && !value.includes('-')) {
      add('Major', key, `"${value}" should be <asset>-<placement>, e.g. email1-cta-button`);
    }
  }
  return issues;
}

// Checks one link. `type` is where the link lives:
//   email: every link to your site needs a full UTM set.
//   page:  links between pages of your own site must have no UTMs.
export function checkUrl(href, { site, campaign, type = 'email', allowed = loadAllowedValues() } = {}) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return { url: href, issues: [{ severity: 'Blocker', param: null, message: 'not a valid URL' }] };
  }
  const issues = [];
  const present = UTM_KEYS.filter((key) => url.searchParams.has(key));
  const own = isOwnSite(url, site);

  if (type === 'page') {
    if (own && present.length) {
      issues.push({ severity: 'Major', param: null, message: 'internal link has UTMs; they overwrite the visitor\'s original source' });
    }
  } else {
    const missing = REQUIRED.filter((key) => !url.searchParams.get(key));
    if (missing.length) {
      if (own || !site) {
        issues.push({ severity: 'Blocker', param: null, message: `missing ${missing.join(', ')}` });
      } else if (present.length === 0) {
        issues.push({ severity: 'Minor', param: null, message: 'third-party link without UTMs' });
      } else {
        issues.push({ severity: 'Major', param: null, message: `partial UTM set, missing ${missing.join(', ')}` });
      }
    }
  }
  if (present.length) issues.push(...checkUtmValues(url.searchParams, { allowed, campaign }));
  return { url: url.href, issues };
}

export function buildUrl({ url, source, medium, campaign, content, term }, allowed = loadAllowedValues()) {
  const base = new URL(url);
  const values = { utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content, utm_term: term };
  const warnings = [];
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    const existing = base.searchParams.get(key);
    if (existing !== null && existing !== value) warnings.push(`replaced existing ${key}="${existing}"`);
    base.searchParams.set(key, value);
  }
  const { issues } = checkUrl(base.href, { campaign, allowed });
  return { url: base.href, issues, warnings };
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      flags[key] = true;
    } else {
      flags[key] = next;
      i++;
    }
  }
  return { positional, flags };
}

const USAGE = `Usage:
  node scripts/utm-builder.mjs build --url <url> --source <source> --medium <medium> --campaign <slug> --content <asset-placement> [--term <keyword>]
  node scripts/utm-builder.mjs check <url> [<url> ...] [--campaign <slug>] [--site <your-domain>] [--type email|page] [--json]`;

function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);
  const allowed = loadAllowedValues();
  if (!allowed.fromFile) console.error('Warning: could not read allowed values from playbooks/naming-conventions.md; using defaults.');

  if (command === 'build') {
    const missing = ['url', 'source', 'medium', 'campaign', 'content'].filter((key) => typeof flags[key] !== 'string');
    if (missing.length) {
      console.error(`Missing --${missing.join(', --')}\n\n${USAGE}`);
      process.exit(2);
    }
    let result;
    try {
      result = buildUrl({ ...flags, term: typeof flags.term === 'string' ? flags.term : undefined }, allowed);
    } catch {
      console.error(`Not a valid URL: ${flags.url}`);
      process.exit(2);
    }
    for (const warning of result.warnings) console.error(`Warning: ${warning}`);
    if (result.issues.length) {
      console.error('Not built. Fix these first:');
      for (const issue of result.issues) console.error(`  [${issue.severity}] ${issue.param ?? 'link'}: ${issue.message}`);
      process.exit(1);
    }
    console.log(result.url);
    return;
  }

  if (command === 'check') {
    if (!positional.length) {
      console.error(USAGE);
      process.exit(2);
    }
    const options = { allowed, campaign: flags.campaign, site: flags.site, type: flags.type === 'page' ? 'page' : 'email' };
    const results = positional.map((href) => checkUrl(href, options));
    if (flags.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      for (const { url, issues } of results) {
        console.log(issues.length ? `✗ ${url}` : `✓ ${url}`);
        for (const issue of issues) console.log(`    [${issue.severity}] ${issue.param ?? 'link'}: ${issue.message}`);
      }
    }
    process.exit(results.some((r) => r.issues.length) ? 1 : 0);
  }

  console.error(USAGE);
  process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
