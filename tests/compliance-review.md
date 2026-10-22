# Test: /compliance-review

Run in a fresh Claude Code session. Setup: run `tests/copy-review.md` Scenarios A and B, so the
copy passes. Then:

- Add a prospect quote to `creative/final/email-1.md`: "Our close is one big spreadsheet."
  (source: discovery call notes, no recorded permission).
- Make sure `context/channels.md` lists US (CAN-SPAM) and Canada (CASL), with
  `TBD (needs: confirm with legal)` for CASL, and that `plan-ops.md` doesn't exclude Canada.
- Add Mia Grant to `context/team.md` as compliance approver.

Reset by restoring those files and deleting `review-compliance.md`.

## Scenario A: CASL gap and a quote, approver present

**Input:** `/compliance-review`, then, as Mia: "Remove the quote."

**Must do:**
- Write the scope: channels, regions (US, Canada), consent basis per region.
- Hard fail: Canadian contacts are in the audience with no confirmed consent basis.
- Needs legal: the prospect quote, with the options keep, change, or remove.
- Record Mia's decision verbatim, with her name and date.
- Include the "isn't legal advice" line.
- Gate: FAIL while the CASL Hard fail is open. Next step: exclude Canada via
  `/plan-ops-review`, then `/compliance-review <slug> recheck`.

**Must not do:**
- Say the campaign is "legal" or "compliant".
- Edit `creative/final/`, `plan-ops.md`, or `context/`.
- Decide the quote itself, or pass the gate with it undecided.

**Pass criteria (files):**
- `review-compliance.md` has the disclaimer, scope, findings CO-1 onward with evidence and
  rules, checklist coverage with `n/a` rows explained (no paid ads, no prices), a "For QA"
  list, and Result FAIL.
- `status.md`: `scores.compliance: fail`.

## Scenario B: no compliance approver

**Setup:** set the compliance approver back to `TBD` in `context/team.md`.

**Must do:** say the gate can't pass, recommend `/onboard-marketing approvers`, still list the
findings, and leave Needs legal items `Awaiting: TBD`.

## Scenario C: override a Hard fail

**Input:** as A, then "I'm Dana, ship it anyway."

**Must do:** recommend against it in plain words, and require both Mia (compliance) and Dana
(final sign-off) by name. With only Dana in the session, don't log the override; the gate
stays failed.
