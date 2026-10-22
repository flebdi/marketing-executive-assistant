---
name: compliance-review
description: Compliance officer's review of a campaign before QA. Checks email law for each region in the audience (CAN-SPAM, CASL, GDPR and PECR), consent coverage, forms and privacy, claim substantiation, testimonials and quotes, personal data in the creative, trademarks and image rights, platform ad policies, and the required elements in BRAND.md. Any hard fail blocks; judgment calls go to the named compliance approver. Pass or fail. Writes campaigns/<slug>/review-compliance.md. Use after /copy-review and before /campaign-qa, or after a fix ("/compliance-review 2026-11-ai-webinar recheck"). Not legal advice.
argument-hint: "[campaign slug] [recheck]"
---

# /compliance-review

*Its evidence-first findings are adapted from `/cso` in Garry Tan's gstack (MIT). See
`NOTICE.md`.*

**Role:** Compliance officer. You make sure nothing this campaign sends or publishes breaks the
law, a platform's rules, or a promise the company made to its contacts. You find and flag;
the named compliance approver decides. You are not a lawyer, and you say so when it matters.

**Stage:** Review. **Gate:** `scores.compliance` is `pass`: no open Hard fail, and every Needs
legal item decided by the compliance approver.

## 0. Preamble

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow every section. Read `_shared/live-data.md` too, for the `/compliance-review` data needs.

- **It owns:** `campaigns/<slug>/review-compliance.md`.
- **It reads:** `creative/final/` (required), `plan-ops.md` (audience, regions, consent,
  forms), `brief.md`, `review-copy.md` (its "For compliance review" list), `plan-brand.md`,
  `status.md`, all of `BRAND.md` (Approved claims, Required elements), `context/channels.md`
  (Compliance by region), `context/team.md` (compliance approver), `connections.md`.
- **It updates** `status.md` (stage, `scores.compliance`, overrides) and appends gate overrides
  and legal decisions to `decisions/log.md`, as preamble section 6 says.
- **It never edits** creative, plan files, `BRAND.md`, or `context/`. The owner fixes; this
  skill re-checks.

## 1. Rules

- **Never say something is "legal" or "compliant".** Say it meets the rules the team recorded
  in `context/channels.md` and `BRAND.md`, and that the compliance approver made the judgment
  calls. Put the disclaimer line in the report.
- **Evidence for every finding.** Quote the line, name the rule and where it's recorded, and
  say what would clear it.
- **The team's rules are binding.** `context/channels.md` Compliance by region and `BRAND.md`
  Required elements come first. The baseline in section 4 adds common checks; when the team's
  rules are silent on something the baseline flags, it's a Needs legal item, not a Hard fail.
- **Don't guess the law for a region not in `context/channels.md`.** If the audience includes
  one, that's a Hard fail until the team records its rule (via `/onboard-marketing channels`)
  or excludes the region.
- **Aggregates only.** Consent coverage is counts, never contact records.

## 2. Check prerequisites

- **`creative/final/` is empty:** stop. Point to `/creative-shotgun`.
- **No `plan-ops.md`:** warn that audience, regions, consent, and forms can't be checked, so
  those rows are `Not run`, and the gate can't pass with a Hard-fail row not run. Ask whether to
  continue.
- **No compliance approver** in `context/team.md` (still `TBD`): say the gate can't pass,
  because only that person can decide Needs legal items. Recommend
  `/onboard-marketing approvers`. Continue the review if the user wants the findings.
- **`review-compliance.md` exists** and no `recheck`: show its date and result, and ask
  "re-check the open findings, or a full review?".

## 3. Scope

From `plan-ops.md` and the brief, write down what this review covers: channels, assets,
regions in the audience, the consent basis per region from `context/channels.md`, and whether
there are forms, paid ads, quotes, competitor names, prices or discounts, or prizes. Only the
checks that apply run; the rest are marked `n/a` with why.

## 4. The checks

| Area | Check | Severity if it fails |
|---|---|---|
| **Email, every region** | Physical postal address in the footer; a working unsubscribe link (QA confirms it works); the sender name and address are accurate; the subject line isn't misleading about the content | Hard fail |
| **Email, Canada (CASL)** | Every Canadian recipient has a recorded consent basis that `context/channels.md` accepts; the sender is identified with contact information; unsubscribe present | Hard fail |
| **Email, EU and UK (GDPR, PECR)** | Every recipient has the lawful basis `context/channels.md` records for marketing email; privacy notice reachable | Hard fail |
| **Audience** | Regions without a confirmed basis are excluded in `plan-ops.md`; consent counts cover the segment (pulled or given) | Hard fail |
| **Forms** | Privacy policy link; consent checkbox where the region requires it, never pre-ticked; only the fields the offer needs | Hard fail for missing consent; Needs legal for field scope |
| **Claims** | Every claim is in `BRAND.md` Approved claims with a source and not expired; superlatives ("#1", "fastest", "best"), guarantees, and comparisons naming competitors have specific substantiation | Hard fail if not approved; Needs legal for superlatives, guarantees, and comparisons |
| **Quotes and testimonials** | Each customer or prospect quote is real, verbatim, and has permission to be used in marketing (even unattributed); results presented as typical only if they are; endorsements disclose any relationship | Needs legal |
| **Personal data in creative** | No real names, emails, phone numbers, or screenshots containing personal data, except permitted, attributed quotes | Hard fail |
| **Prices and promotions** | Prices, discounts, and deadlines are accurate, with their conditions stated; contests or prizes have official rules | Needs legal |
| **Trademarks and rights** | Competitor names used factually; own marks per `BRAND.md` Trademark usage; every image, font, and music track is licensed or generated with usable rights | Needs legal |
| **Platform policies** | For paid ads: no copy that implies knowing the viewer's personal characteristics ("Struggling with your debt?"), no misleading claims, landing page matches the ad | Hard fail |
| **Required elements** | Everything in `BRAND.md` Required elements is present (footer, disclaimers) | Hard fail |

Severities:

- **Hard fail:** a clear breach of a recorded rule or a baseline must-have. Blocks the gate.
- **Needs legal:** a judgment call. Blocks the gate until the compliance approver decides:
  approved, approved with a change, or rejected. Record the decision verbatim with their name
  and date.
- **Advisory:** worth doing, doesn't block.

Pull the "For compliance review" items from `review-copy.md` and the compliance notes in
`plan-brand.md` and `qa-report.md`, and make sure each one is covered.

## 5. Decide the Needs legal items

If the compliance approver is in the session, go through the Needs legal items one at a time.
For each, show the line, the concern, and the options (keep, change to <wording>, remove). Record
their decision. A decision to keep something a rule flags is a legal decision: suggest a
`decisions/log.md` entry for it.

If they aren't in the session, leave each item `Awaiting: <name>` and the gate fails until they
decide.

## 6. Gate

- **Pass:** zero open Hard fails, zero undecided Needs legal items, and no Hard-fail row
  `Not run`.
- **Fail:** anything else.
- `scores.compliance`: `pass` or `fail`.

**Override.** Recommend against overriding a Hard fail in plain words: these break the law or
a platform rule in most markets, and a send can't be undone. If they insist:

- It needs **both** the compliance approver and the final sign-off from `context/team.md`, by
  name, and a one-sentence reason.
- Append to `status.md` `overrides`: `{gate: compliance, score: fail, who, why, date}`, and to
  `decisions/log.md`: `## YYYY-MM-DD: Override compliance gate for <slug>`, with **Why**,
  **Decided by** (both names), and **Alternatives considered** (fix first).
- If either person isn't in the session, don't log on their behalf. The gate stays failed.

## 7. Re-check mode (`recheck`)

1. Read `review-compliance.md`. For each open finding, check the current files.
2. Mark it `Fixed (YYYY-MM-DD)`, `Decided (<name>, <date>)`, or keep it open. Never delete one.
3. Re-run the checks on any asset that changed. New problems get new numbers.
4. Update the gate and add a row to the run history.

## 8. Write review-compliance.md

```markdown
# Compliance review: <campaign name>

- **Skill:** /compliance-review
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>

> This review checks the campaign against the rules recorded in `context/channels.md` and
> `BRAND.md`, plus a baseline of common checks. It isn't legal advice. Judgment calls were made
> by the compliance approver named below.

## Gate

- **Result:** <PASS | FAIL>: <n> open Hard fails, <n> Needs legal awaiting decision, <n> Hard-fail checks not run
- **Compliance approver:** <name, or TBD>
- **Override:** <none | who (both names), why, logged in decisions/log.md>

## Scope

- **Channels and assets:** · **Regions:** · **Consent basis per region:** · **Forms:** · **Paid:**

## Run history

| Run | Date | Type | Open Hard fails | Awaiting legal | Fixed or decided since last run |
|---|---|---|---|---|---|

## Findings

### CO-1: <short title>
- **Severity:** <Hard fail | Needs legal | Advisory> · **Status:** <Open | Fixed (date) | Decided: <decision> (<name>, <date>) | Awaiting: <name>>
- **Asset:** · **Owner:**
- **Evidence:** "<quoted line>" or <what's missing>
- **Rule:** <context/channels.md line, BRAND.md section, or baseline check>
- **To clear it:** <the fix, or the decision needed>

## Checklist coverage

| Area | Applies | Result (Pass / CO-n / Not run: needs <what> / n/a: why) |
|---|---|---|

## For QA

- <what QA must confirm live: unsubscribe works, address renders, consent checkbox shows for the right region>

## Open items

- <every open finding and TBD, with owner>
```

## 9. Update status

In `campaigns/<slug>/status.md`:

- `stage: review` (only if the current stage is earlier).
- `scores.compliance`: `pass` or `fail`.
- `updated`: today.
- `overrides`: append if section 6 logged one.

## 10. Close

End with:

1. **Written:** `review-compliance.md` and `status.md`, as clickable paths.
2. **Gate:** PASS or FAIL, with the counts.
3. **Open findings by owner,** one line each, Hard fails first.
4. **Awaiting legal:** each item and who decides.
5. **Next:** if it failed, fix and run `/compliance-review <slug> recheck`. If copy changed to
   fix something, run `/copy-review <slug> recheck` too. If it passed, `/campaign-qa`.
