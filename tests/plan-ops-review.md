# Test: /plan-ops-review

Run in a fresh Claude Code session. Setup: run `tests/plan-brand-review.md` Scenario A, so the
brief, `plan-cmo.md` (LinkedIn cut), and `plan-brand.md` exist for Northwind (fictional). Set
`**Website:** northwind.example` in `context/company.md`. No tools are connected.

Reset by deleting `plan-ops.md` and restoring `status.md` from the end of the setup.

## Scenario A: full plan with gaps

**Input:** `/plan-ops-review`

| Step | User says |
|---|---|
| Who decides? | "Sam decides ops, I'm Sam." |
| Missing: segment count | "Don't know." |
| Missing: landing page | "Jira ticket WEB-412, due 2026-10-30." |
| Missing: form fields | "First name, last name, work email, company." |
| Hand-off | "SDRs follow up on attendees within one business day." |
| QA date | "2026-10-30." |
| Create tasks? | "No, just list them." |
| Verdict | "Go with changes." |

**Must do:**
- Walk the intake checklist and ask for each missing item one at a time.
- Record the segment count as `TBD (needs: count from HubSpot)`, never an estimate.
- Ask about Canadian contacts' consent (CASL), and exclude or flag Canada if it's unconfirmed.
- Build every link with `scripts/utm-builder.mjs build`, with `utm_campaign` equal to the slug
  and a unique `utm_content` per placement. No LinkedIn links (cut by the CMO review).
- Name the Salesforce campaign per naming conventions: `2026-11 | Webinar | <Short name>`.
- Show the lead-time math in business days for the landing page and the email.
- Write a QA test plan with severities, and a launch settings table.
- Include a stop plan in the edge cases.
- Close with `/creative-shotgun` as next.

**Must not do:**
- Type a UTM link by hand, or put a UTM on the landing page → thank-you link.
- Write any contact's name or email into the plan.
- Create tasks or tickets.
- Pass the gate while a Required intake item is missing (cap at 6).

**Pass criteria (files):**
- `plan-ops.md` has every template section; the tracking table has full URLs that
  `node scripts/utm-builder.mjs check` accepts with `--campaign <slug>`; every date check shows
  its math; Decision by Sam Ortiz.
- `node scripts/link-check.mjs tests/fixtures/qa/email-1.html --expect campaigns/<slug>/plan-ops.md --offline`
  reads the planned links without error.
- `status.md`: `scores.ops` equals the overall, `updated` today.

## Scenario B: no hand-off

**Input:** as A, but answer the hand-off question "Not sure yet."

**Must do:** treat the missing hand-off as a blocker, score Systems at 3 or below, and cap the
overall at 6.
