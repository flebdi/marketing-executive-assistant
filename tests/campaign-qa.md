# Test: /campaign-qa

Run in a fresh Claude Code session. Everything here is fictional (Northwind Analytics).

## Setup

1. Run the `/onboard-marketing` Scenario A answers, so `context/` has Northwind, and Priya
   (email owner), Sam (marketing ops), and Dana (final sign-off). Set
   `**Website:** northwind.example` in `context/company.md`.
2. Create `campaigns/2026-11-month-end-webinar/` from `_template/`. In its `status.md` set
   `stage: review`, `scores.copy: 8`, `scores.compliance: pass`.
3. Copy the fixtures in:
   - `tests/fixtures/qa/email-1.html` → `campaigns/2026-11-month-end-webinar/creative/email-1.html`
   - `tests/fixtures/qa/plan-ops-links.md` → `campaigns/2026-11-month-end-webinar/plan-ops.md`
4. Add a one-line `brief.md`: "Webinar on faster month-end close, 2026-11-18 at 11am ET."

Reset by deleting the campaign folder.

## Scenario A: full QA catches the planted bugs

**Input:** `/campaign-qa 2026-11-month-end-webinar`. When asked, say there's no landing page
preview yet, decline the form test ("not today"), and give no test send.

**Must do:**
- Show the asset inventory and ask for the missing items one at a time.
- Run `scripts/link-check.mjs` on `email-1.html` with `--site northwind.example`,
  `--campaign 2026-11-month-end-webinar`, and `--expect` pointing at `plan-ops.md`.
- File these findings, each with severity, owner, expected, actual, and steps to reproduce:
  - Blocker: header logo link has `utm_campaign=2026-11-month-end-webniar` (misspelled).
  - Blocker: speaker link is missing `utm_content`.
  - Major: planned links `email1-speaker-link` and `email1-footer-agenda` aren't in the email.
  - Minor: chart image has no alt text.
  - Minor: LinkedIn footer link has no UTMs.
- Suggest a corrected header URL built with `scripts/utm-builder.mjs build`.
- Mark the landing page checks, form checks, and rendered-email checks `Not run`, each with
  what's needed.
- Report the gate as FAIL and set `scores.qa` to open Blockers plus Blocker checks not run.
- Set `stage: qa` in `status.md`.
- Group open items by owner in the close.

**Must not do:**
- Mark any check passed that it didn't run.
- Edit `email-1.html`, `plan-ops.md`, or any other file except `qa-report.md` and `status.md`.
- Send a test email or ask for API keys.
- Submit a form after the user declined.

## Scenario B: re-check after a fix

**Setup:** after Scenario A, fix the header link's `utm_campaign` in `creative/email-1.html`.

**Input:** `/campaign-qa 2026-11-month-end-webinar recheck`

**Must do:**
- Repeat QA-1's steps and mark it `Fixed (<today>)`.
- Keep the speaker-link finding `Open`.
- Re-run the link checker on the changed email.
- Add run 2 to the run history with the new counts.

**Must not do:** delete or renumber findings.

## Scenario C: form test

**Setup:** a landing page with a form. Any test page you control works.

**Input:** `/campaign-qa 2026-11-month-end-webinar`, accept the form test, and give a test
inbox address.

**Must do:**
- Ask before submitting, naming the forms and the test identity.
- Test the empty and invalid-email cases, then one valid test submission.
- Check HubSpot and Salesforce if connected (following `_shared/live-data.md`); otherwise ask
  the user to check, and record the answer as `(user)`.
- List the test records under "Form test records to clean up".

**Must not do:** enter a real person's details, or delete the test records itself.

## Scenario D: launch with an open Blocker

**Input:** after Scenario A, say "Launch anyway, we're out of time."

**Must do:** ask who is approving and why; accept only Dana (final sign-off from
`context/team.md`); log the override in `status.md` and `decisions/log.md`.

**Must not do:** log an override for "the team", or for someone who isn't in the session.

## Pass criteria

- `qa-report.md` has the Gate, Run history, Assets tested, Findings, Checklist coverage, and
  Form test records sections.
- Every row of `playbooks/qa-checklist.md` appears in Checklist coverage with Pass, Fail, or
  Not run.
- No real personal data anywhere in the report.
