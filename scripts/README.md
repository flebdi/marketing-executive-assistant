# Scripts

Helpers that skills call. Node.js 18 or later, no dependencies, cross-platform. You can also
run them yourself.

## utm-builder.mjs

Builds tracked links and checks them against `playbooks/naming-conventions.md`. Allowed
`utm_source` and `utm_medium` values are read from that file, so add new values there.

```bash
# Build a link. Refuses to build one that breaks the naming rules.
node scripts/utm-builder.mjs build --url https://example.com/webinar \
  --source hubspot --medium email --campaign 2026-11-ai-webinar --content email1-cta-button

# Check links. --type page checks links on your own site instead (they must have no UTMs).
node scripts/utm-builder.mjs check "<url>" "<url>" --site example.com --campaign 2026-11-ai-webinar
```

Used by `/plan-ops-review` (building the planned links) and `/campaign-qa`.

## link-check.mjs

Lists every link in an HTML email or a landing page and checks it:

- Does it open? Follows redirects, and catches 404s, dead domains, loops, and redirects that
  drop UTMs.
- Are the UTMs complete and do they follow the naming rules?
- With `--expect <file>`: does each link match the planned URL with the same `utm_content`?
  Any file with full URLs works, usually the campaign's `plan-ops.md`.
- Whole-asset basics: unsubscribe link, image alt text, personalization tokens, and for
  pages, the title, meta description, and tracking code.

```bash
node scripts/link-check.mjs campaigns/<slug>/creative/email-1.html \
  --site example.com --campaign <slug> --expect campaigns/<slug>/plan-ops.md
node scripts/link-check.mjs https://example.com/webinar --type page --site example.com
```

Options: `--rendered` (the HTML is a rendered test send, so raw `{{tokens}}` are Blockers),
`--offline` (skip network checks), `--json` (machine-readable output).

Severities follow `playbooks/qa-checklist.md`. `Check` means a person must verify it in a
browser. Exit code 1 means at least one Blocker.

Try it on the fictional fixture, which has deliberate bugs:

```bash
node scripts/link-check.mjs tests/fixtures/qa/email-1.html --site northwind.example \
  --campaign 2026-11-month-end-webinar --expect tests/fixtures/qa/plan-ops-links.md --offline
```

Used by `/campaign-qa`.

## due.mjs

Lists what's due today across campaigns, `BRAND.md`, and `context/`. The routines in
`routines/` run it first and act only on what it finds.

- **QA countdown:** a launch exactly 3 or 1 business days away (re-run `/campaign-qa`).
- **At risk:** a launch within 5 business days with a gate not passed and no override, or a
  launch date that passed while the campaign is still pre-launch.
- **Retro due:** a launched campaign past its brief's goal date with no `retro.md`.
- **Stuck:** a pre-launch campaign with no `status.md` update in 7+ days.
- **Claims:** `BRAND.md` Approved claims expired or expiring within 30 days.
- **Context:** quarterly goals ended or ending within 30 days, past rows in the calendar's
  upcoming launches, tools marked broken in `connections.md`.

```bash
node scripts/due.mjs                       # today
node scripts/due.mjs --date 2026-11-05     # as if it were that day
node scripts/due.mjs --only qa --json      # one check, machine-readable
```

Business days are Monday to Friday. Used by the routines in `routines/`.
