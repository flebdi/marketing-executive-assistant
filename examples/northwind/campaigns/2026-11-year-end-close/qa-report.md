# QA report: Year-End Close Readiness

- **Skill:** /campaign-qa
- **Date:** 2026-10-22
- **Campaign:** 2026-11-year-end-close
- **Inputs read:** status.md, brief.md, plan-cmo.md, creative/final/email-1.html, playbooks/qa-checklist.md, playbooks/naming-conventions.md, context/company.md, context/channels.md, context/team.md, connections.md
- **Tested with:** link-check.mjs (`--offline`), utm-builder.mjs. No browser, no test send, no landing page yet.

Early run, by choice of Dana Cole: no `plan-ops.md` yet (plan checks skipped), copy and compliance reviews not run, landing page not built (Jira due 2026-11-05). Findings may change when copy changes.

## Gate

- **Result:** FAIL: 1 open Blocker, 7 Blocker checks not run, 0 open Majors
- **Override:** none
- **Accepted Majors:** none

## Run history

| Run | Date | Type | Open Blockers | Open Majors | Fixed since last run |
|---|---|---|---|---|---|
| 1 | 2026-10-22 | full (early, baseline only) | 1 | 0 | n/a |

## Assets tested

| Asset | Type | Source tested | Link check | Browser check |
|---|---|---|---|---|
| Email 1 | email | creative/final/email-1.html (draft, not a rendered test send) | Run, offline: 0 Blocker, 0 Major, 0 Minor | Not run: needs a HubSpot test send |
| Landing page | page | none | Not run: page not built | Not run: page not built |
| Checklist + booking form | form | none | n/a | Not run: page not built |

## Findings

### QA-1: Email footer has a placeholder instead of a physical address
- **Severity:** Blocker · **Status:** Open
- **Asset:** Email 1 · **Check:** Physical address in footer · **Owner:** Leo Park (asset); address from Mia Grant
- **Expected:** Northwind Analytics' physical postal address in the footer (CAN-SPAM; BRAND.md Required elements).
- **Actual:** Footer reads "Northwind Analytics · [ADDRESS TBD]".
- **Steps to reproduce:**
  1. Open `campaigns/2026-11-year-end-close/creative/final/email-1.html`.
  2. Scroll to the footer below the horizontal rule.
  3. Read the line before the Unsubscribe link.
- **Suggested fix:** Mia Grant supplies the address; add it to BRAND.md Required elements via `/onboard-marketing voice`, then Leo replaces the placeholder (better: use the HubSpot office-location footer token so it can't drift).

## Checklist coverage

| Check | Severity | Result |
|---|---|---|
| Every link opens (no 404, no redirect loop) | Blocker | Not run: ran offline; destination page not live until 2026-11-05 |
| Every external link has a full UTM set that matches `plan-ops.md` | Blocker | Not run: UTM sets are complete on all 3 web links, but there's no `plan-ops.md` to match against |
| UTM values follow `naming-conventions.md` | Major | Pass (link-check.mjs) |
| No UTMs on internal links | Major | Pass (no internal links in the email) |
| Tracking code fires on the landing page (GA4, HubSpot) | Major | Not run: page not built |
| Test submission succeeds and shows the thank-you page | Blocker | Not run: page not built |
| Test record lands in HubSpot with the right list membership | Blocker | Not run: page not built |
| Test record syncs to Salesforce with the right campaign member status | Major | Not run: page not built; Salesforce campaign not created yet |
| Required fields and error messages work | Major | Not run: page not built |
| Unsubscribe link works | Blocker | Not run: link present (HubSpot token), needs a test send |
| Physical address in footer | Blocker | Fail QA-1 |
| Personalization tokens render and have fallbacks | Blocker | Not run: fallback present in source (`default("there")`), needs a test send to a contact with a blank first name |
| Subject line and preview text match the approved version | Major | Not run: no `review-copy.md` yet |
| Renders at mobile width (375px) | Major | Not run: needs a test send or browser view |
| Images have alt text | Minor | Pass (link-check.mjs) |
| Offer, date, time, and time zone match the brief | Blocker | Not run: page not built |
| Readable at mobile width, CTA visible | Major | Not run: page not built |
| Page title and meta description set | Minor | Not run: page not built |
| Loads in under 3 seconds | Minor | Not run: page not built |

## Form test records to clean up

No test submissions.

## Notes

- link-check Info: unsubscribe and manage-preferences links are HubSpot tokens, filled at send time.
- link-check Info: personalization token `{{ contact.firstname | default("there") }}` has a fallback; confirm in a test send.
- No preview text is set in the HTML. Not a checklist failure on its own; `/copy-review` should approve one.
- For `/compliance-review`: Email 1 quotes a prospect's discovery call verbatim. Confirm the quote may be used in marketing, even unattributed.
- link-check.mjs doesn't detect a missing or placeholder physical address. QA-1 was found by reading the HTML.
