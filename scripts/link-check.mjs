#!/usr/bin/env node
// Lists every link in an HTML email or landing page and checks it: does it open, are the UTMs
// right, do they match the plan, and does the asset have the basics (unsubscribe link, alt
// text, rendered personalization).
//
// Usage:
//   node scripts/link-check.mjs <file.html | https://page-url> [--type email|page]
//        [--site <your-domain>] [--campaign <slug>] [--expect <file>] [--rendered]
//        [--offline] [--json]
//
//   --type      email (default for files) or page (default for URLs).
//   --site      your own domain, e.g. northwind.example. Decides which links need UTMs.
//   --campaign  the campaign slug every utm_campaign must equal.
//   --expect    a file listing the planned links (usually the campaign's plan-ops.md). Links are
//               matched by utm_content and must equal the planned URL.
//   --rendered  the HTML is a rendered test send, so raw {{tokens}} are a Blocker.
//   --offline   skip the network: no status checks.
//
// Severity follows playbooks/qa-checklist.md: Blocker, Major, Minor. "Check" means a person
// must verify it in a browser. Exit code: 1 if any Blocker, 2 on bad usage, otherwise 0.

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { SEVERITY_ORDER, UTM_KEYS, checkUrl, loadAllowedValues } from './utm-builder.mjs';

const TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 10;
const CONCURRENCY = 5;
const TOKEN_PATTERN = /\{\{[^}]+\}\}|\{%[^%]+%\}|%%[^%\s]+%%|\*\|[^|]+\|\*/g;
const SYSTEM_LINK = /unsubscribe|opt[-_ ]?out|preferences|email[-_ ]?settings|view (it )?in (your )?browser|webversion/i;
const BOT_BLOCKED = new Set([401, 403, 429, 999]);

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function attr(attrs, name) {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!match) return null;
  return decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
}

function textOf(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function extractLinks(html) {
  const links = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attr(match[1], 'href');
    if (href === null) continue;
    const imgAlt = match[2].match(/<img\b[^>]*>/i) ? attr(match[2].match(/<img\b[^>]*>/i)[0], 'alt') : null;
    const text = textOf(match[2]) || (imgAlt ? `[image: ${imgAlt}]` : '[no text]');
    links.push({ href: href.trim(), text: text.length > 50 ? `${text.slice(0, 47)}...` : text });
  }
  return links;
}

function classify(href, text) {
  if (href === '' || href.startsWith('#') || /^(mailto|tel|sms|javascript):/i.test(href)) return 'other';
  if (href.match(TOKEN_PATTERN)) return 'token';
  if (SYSTEM_LINK.test(href) || SYSTEM_LINK.test(text)) return 'system';
  return 'web';
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; link-check; marketing-executive-assistant)' },
  });
  await response.body?.cancel();
  return response;
}

// Follows redirects by hand so loops and dropped UTMs can be reported.
export async function fetchStatus(url) {
  const seen = new Set([url]);
  const chain = [];
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let response;
    try {
      response = await request(current, 'HEAD');
      if ([403, 405, 501].includes(response.status)) response = await request(current, 'GET');
    } catch (error) {
      const reason = error.name === 'TimeoutError' ? 'timed out' : (error.cause?.code ?? error.message);
      return { ok: false, error: reason, chain };
    }
    chain.push(response.status);
    const location = response.headers.get('location');
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, current).href;
      if (seen.has(next)) return { ok: false, error: 'redirect loop', chain, finalUrl: next };
      seen.add(next);
      current = next;
      continue;
    }
    return { ok: response.status < 400, status: response.status, chain, finalUrl: current };
  }
  return { ok: false, error: `more than ${MAX_REDIRECTS} redirects`, chain, finalUrl: current };
}

async function mapLimited(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

// Planned links, keyed by utm_content, from any text file that contains full URLs.
function loadExpected(file) {
  const text = readFileSync(file, 'utf8');
  const expected = new Map();
  for (const match of text.matchAll(/https?:\/\/[^\s)<>"'`|\]]+/g)) {
    try {
      const url = new URL(match[0]);
      const content = url.searchParams.get('utm_content');
      if (content) expected.set(content, url);
    } catch {
      // Not a URL after all; ignore.
    }
  }
  return expected;
}

function compareToPlan(url, planned) {
  const issues = [];
  if (`${url.origin}${url.pathname}` !== `${planned.origin}${planned.pathname}`) {
    issues.push({ severity: 'Blocker', message: `goes to ${url.origin}${url.pathname}, plan says ${planned.origin}${planned.pathname}` });
  }
  for (const key of UTM_KEYS) {
    const actual = url.searchParams.get(key);
    const want = planned.searchParams.get(key);
    if (actual !== want) {
      issues.push({ severity: 'Blocker', message: `${key} is "${actual ?? '(missing)'}", plan says "${want ?? '(none)'}"` });
    }
  }
  return issues;
}

export async function checkAsset(html, options) {
  const { type, site, campaign, expectFile, rendered, offline, baseUrl } = options;
  const allowed = loadAllowedValues();
  const expected = expectFile ? loadExpected(expectFile) : null;
  const assetIssues = [];
  const add = (list, severity, message) => list.push({ severity, message });

  const links = extractLinks(html).map((link) => {
    let href = link.href;
    if (baseUrl && !/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith('#')) {
      href = new URL(href, baseUrl).href;
    }
    return { ...link, href, kind: classify(href, link.text), issues: [] };
  });

  for (const link of links) {
    if (link.kind === 'token') {
      if (rendered) add(link.issues, 'Blocker', 'unrendered personalization token in the link');
      else add(link.issues, 'Info', 'filled in by the email tool at send time; check it in a test send');
    }
    if (link.kind !== 'web') continue;
    let planned = null;
    let content = null;
    try {
      content = new URL(link.href).searchParams.get('utm_content');
      planned = expected && content ? expected.get(content) ?? null : null;
    } catch {
      // Invalid URL; checkUrl reports it.
    }
    // A planned link is compared value by value below, so skip the separate campaign check.
    const { issues } = checkUrl(link.href, { site, campaign: planned ? undefined : campaign, type, allowed });
    link.issues.push(...issues.map(({ severity, param, message }) => ({ severity, message: param ? `${param}: ${message}` : message })));
    if (planned) link.issues.push(...compareToPlan(new URL(link.href), planned));
    else if (expected && content) add(link.issues, 'Major', `utm_content "${content}" isn't in the plan`);
  }

  if (!offline) {
    const toFetch = [...new Set(links.filter((l) => l.kind === 'web' || l.kind === 'system').map((l) => l.href))]
      .filter((href) => /^https?:/i.test(href));
    const statuses = new Map(await mapLimited(toFetch, CONCURRENCY, async (href) => [href, await fetchStatus(href)]));
    for (const link of links) {
      const result = statuses.get(link.href);
      if (!result) continue;
      link.status = result.error ?? result.chain.join(' → ');
      if (result.error) add(link.issues, 'Blocker', `doesn't open: ${result.error}`);
      else if (BOT_BLOCKED.has(result.status)) add(link.issues, 'Check', `returned ${result.status}, often a bot block; open it in a browser`);
      else if (!result.ok) add(link.issues, 'Blocker', `returns ${result.status}`);
      if (result.finalUrl && result.finalUrl !== link.href) {
        const before = new URL(link.href).searchParams;
        const after = new URL(result.finalUrl).searchParams;
        const dropped = UTM_KEYS.filter((key) => before.has(key) && !after.has(key));
        if (dropped.length) add(link.issues, 'Major', `redirect drops ${dropped.join(', ')} (lands on ${result.finalUrl})`);
      }
    }
  }

  if (expected && type === 'email') {
    const found = new Set(links.map((l) => { try { return new URL(l.href).searchParams.get('utm_content'); } catch { return null; } }));
    const assets = new Set([...found].filter(Boolean).map((c) => c.split('-')[0]));
    const missing = [...expected.keys()].filter((c) => assets.has(c.split('-')[0]) && !found.has(c));
    if (missing.length) add(assetIssues, 'Major', `planned links not found in this asset: ${missing.join(', ')}`);
  }

  if (type === 'email' && !links.some((l) => /unsubscribe|opt[-_ ]?out/i.test(`${l.href} ${l.text}`))) {
    add(assetIssues, 'Blocker', 'no unsubscribe link found');
  }

  // Tokens inside links are reported per link above, so only look at the rest of the HTML.
  const body = html.replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, '').replace(/\bhref\s*=\s*("[^"]*"|'[^']*')/gi, '');
  const tokens = [...new Set(body.match(TOKEN_PATTERN) ?? [])];
  if (tokens.length) {
    if (rendered) add(assetIssues, 'Blocker', `unrendered personalization tokens: ${tokens.join(', ')}`);
    else add(assetIssues, 'Info', `personalization tokens: ${tokens.join(', ')}. Check they render and have fallbacks in a test send.`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const alt = attr(match[1], 'alt');
    const src = attr(match[1], 'src') ?? '(no src)';
    if (alt === null) add(assetIssues, 'Minor', `image without alt text: ${src}`);
  }

  if (type === 'page') {
    if (!/<title\b[^>]*>\s*\S[\s\S]*?<\/title>/i.test(html)) add(assetIssues, 'Minor', 'no page title');
    if (!/<meta\b[^>]*name\s*=\s*["']?description["']?[^>]*>/i.test(html)) add(assetIssues, 'Minor', 'no meta description');
    const trackers = [];
    if (/googletagmanager\.com\/(gtag\/js|gtm\.js)|\bGTM-[A-Z0-9]+|\bG-[A-Z0-9]{6,}/.test(html)) trackers.push('Google tag / GA4');
    if (/js\.hs-scripts\.com|js\.hs-analytics\.net|_hsq/.test(html)) trackers.push('HubSpot');
    if (trackers.length) add(assetIssues, 'Info', `tracking code in the HTML: ${trackers.join(', ')}. Confirm it fires in the browser.`);
    else add(assetIssues, 'Check', 'no GA4, Google tag, or HubSpot code found in the HTML. It may load another way; confirm in the browser.');
  }

  const all = [...assetIssues, ...links.flatMap((l) => l.issues)];
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, all.filter((i) => i.severity === s).length]));
  return { links, assetIssues, counts };
}

function printReport(source, type, result) {
  const { links, assetIssues, counts } = result;
  const kinds = ['web', 'system', 'token', 'other'].map((k) => `${links.filter((l) => l.kind === k).length} ${k}`).join(', ');
  console.log(`link-check: ${source} (${type})`);
  console.log(`Links: ${links.length} (${kinds})\n`);
  links.forEach((link, i) => {
    const mark = link.issues.some((x) => ['Blocker', 'Major', 'Minor'].includes(x.severity)) ? '✗' : '✓';
    console.log(`${mark} ${i + 1}. "${link.text}" [${link.kind}]${link.status ? ` ${link.status}` : ''}`);
    console.log(`     ${link.href}`);
    for (const issue of link.issues) console.log(`     [${issue.severity}] ${issue.message}`);
  });
  if (assetIssues.length) {
    console.log('\nWhole asset:');
    for (const issue of assetIssues) console.log(`  [${issue.severity}] ${issue.message}`);
  }
  console.log(`\nSummary: ${SEVERITY_ORDER.map((s) => `${counts[s]} ${s}`).join(', ')}`);
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

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [source] = positional;
  if (!source) {
    console.error('Usage: node scripts/link-check.mjs <file.html | https://page-url> [--type email|page] [--site <domain>] [--campaign <slug>] [--expect <file>] [--rendered] [--offline] [--json]');
    process.exit(2);
  }
  const isUrl = /^https?:\/\//i.test(source);
  const type = flags.type === 'page' || flags.type === 'email' ? flags.type : isUrl ? 'page' : 'email';

  let html;
  try {
    if (isUrl) {
      const response = await fetch(source, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`page returned ${response.status}`);
      html = await response.text();
    } else {
      html = readFileSync(source, 'utf8');
    }
  } catch (error) {
    console.error(`Couldn't read ${source}: ${error.message}`);
    process.exit(2);
  }

  const result = await checkAsset(html, {
    type,
    site: typeof flags.site === 'string' ? flags.site : undefined,
    campaign: typeof flags.campaign === 'string' ? flags.campaign : undefined,
    expectFile: typeof flags.expect === 'string' ? flags.expect : undefined,
    rendered: Boolean(flags.rendered),
    offline: Boolean(flags.offline),
    baseUrl: isUrl ? source : undefined,
  });

  if (flags.json) console.log(JSON.stringify({ source, type, ...result }, null, 2));
  else printReport(source, type, result);
  // Set the code instead of calling process.exit(): exiting while fetch sockets are still
  // closing crashes Node on Windows.
  process.exitCode = result.counts.Blocker > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
