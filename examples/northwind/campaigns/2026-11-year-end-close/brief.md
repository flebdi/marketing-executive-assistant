# Brief: Year-End Close Readiness

- **Skill:** /campaign-office-hours
- **Date:** 2026-10-22
- **Campaign:** 2026-11-year-end-close
- **Inputs read:** BRAND.md, context/company.md, context/audiences.md, context/team.md, context/channels.md, context/calendar.md, connections.md, ETHOS.md, learnings/learnings.md, playbooks/intake-checklist.md, playbooks/naming-conventions.md
- **Ready for planning:** yes
- **Revised:** 2026-10-22, segment count added after /plan-cmo-review

## In one sentence

US VP Finance prospects get a Year-End Close Checklist plus a 30-minute working session, by email, to create 12 SAOs by 2026-12-18.

## Goal

- **Metric:** Marketing-sourced sales-accepted opportunities (SAOs) from this campaign
- **Target:** 12
- **By:** 2026-12-18
- **Ties to quarterly goal:** Goal 1, 120 marketing-sourced SAOs by 2026-12-31 (10% of it)
- **Hand-off:** SDR team (Jordan Lee, SDR manager, Sales; not in context/team.md) via Salesforce lead routing; working sessions run by a Northwind solutions consultant

## Audience

- **Persona:** VP Finance ([context/audiences.md](../../context/audiences.md))
- **This campaign narrows to:** US only, prospects only (no customers, no open opportunities), 200-2,000 employee SaaS
- **Segment / list:** HubSpot list "VP Finance - NA prospects", filtered to US (1,150 contacts after exclusions; Sam Ortiz, HubSpot, 2026-10-22)
- **Exclusions:** unsubscribed, competitors list, current customers, contacts on open Salesforce opportunities, all Canadian contacts (until CASL consent wording is confirmed)

## Evidence

- **Demand (Q1):** 14 inbound requests about year-end close logged in Salesforce, Nov-Dec 2025 (9 prospects, 5 customers). Source: Jordan Lee's Salesforce report. · **Strength:** strong
- **Status quo (Q2):** A spreadsheet checklist plus the auditor's PBC (prepared-by-client) list. · **Competitors say:** Pigment's Q4 webinars focus on 2027 budgeting, not the close (source: Pigment events page, per Dana Cole).
- **Observation (Q5):** "Our year-end close is basically one big spreadsheet and my auditor's PBC list." VP Finance prospect, recorded discovery call, 2026-10-14 (Priya Shah's notes).

## Offer and message

- **Offer:** Year-End Close Checklist (PDF) plus an optional 30-minute working session to walk through it against their own close
- **Core message:** Your year-end close shouldn't be one big spreadsheet and a PBC list. Here's the checklist, and 30 minutes to make it yours.
- **Proof:** "Month-end close drops from 8 days to 5" (Contoso case study, 2026-05)
- **Claims needing a source:** "Finish year-end close a week earlier" (requested by Dana Cole; not in BRAND.md Approved claims, do not use until sourced)

## Channels

| Channel | Tool | Assets | Rules that apply |
|---|---|---|---|
| Email | HubSpot | Email 1 (test), Email 2 (only if the test scales) | Max 2 per contact per week; standard suppressions; CAN-SPAM footer |
| Landing page | HubSpot (built via Jira) | Checklist download + session booking page, thank-you page | 10 business day lead time |

**Per-channel details:**
- **Email:** sender Priya Shah <priya@northwind.example>; segment above; suppressions above; 1 send (test) + 1 conditional; Tue 10:00 America/New_York.
- **Landing page:** Jira ticket TBD (needs: ticket, Sam Ortiz); form fields first name, last name, work email, company, employee count, "book a session" checkbox; thank-you page with booking link; Salesforce campaign "2026-11 | Email | Year-End Close", member status Responded.

## Smallest test (Q4)

- **Test:** One email to the US segment, Tue 2026-11-10 10:00 America/New_York, read after 7 days
- **Scale if:** 3 or more sessions booked within 7 days → send Email 2 to non-responders on Tue 2026-11-17
- **Stop if:** 0 sessions booked and click rate under 1% after 7 days
- **If no test is possible:** n/a

## Budget and timeline

- **Budget:** none (in-house content, no paid)
- **Launch:** 2026-11-10 10:00 America/New_York
- **Calendar check:** clear. Not a blackout. The 2026-11-04 product update goes to customers, who are excluded here. Email 2 (2026-11-17) is 7 days later and ends before the 2026-11-25 blackout.
- **Lead-time check:** clear but tight. Landing page: 2026-10-22 + 10 business days = 2026-11-05, 3 business days before launch. Email: + 5 business days = 2026-10-29.

## Owner and approvers

- **Requested by:** self-initiated (Dana Cole, VP Marketing)
- **Owner:** Priya Shah
- **Copy:** Priya Shah · **Brand:** Dana Cole · **Compliance:** Mia Grant · **Final sign-off:** Dana Cole

## Future-fit (Q6)

The checklist becomes an always-on gated asset in Q1 2027, and booked sessions create a list of VP Finance prospects who've opted in.

## Risks

- **Riskiest assumption:** VP Finance prospects will book a live session in November (pre-close crunch) rather than only download the checklist.
- Landing page has only 3 business days of buffer before launch.
- At the CMO review's hypothesised rates, 1,150 contacts yield ~6 SAOs per email, so 12 needs Email 2.
- Footer physical address is still TBD in BRAND.md (a QA Blocker if not fixed).

## Learnings applied

No learnings yet for this audience or channel.

## Open items

- Jira ticket for the landing page build (Sam Ortiz)
- Source for "Finish year-end close a week earlier", or drop it (Dana Cole)
- Physical address for the email footer (Mia Grant)
- Who runs the working sessions: name a solutions consultant (Jordan Lee)
