# Test: /plan-brand-review

Run in a fresh Claude Code session. Setup: run `tests/campaign-office-hours.md` Scenario A and
`tests/plan-cmo-review.md` Scenario A (Northwind Analytics, fictional), so the brief exists with
"#1 FP&A tool" under Claims needing a source, the Contoso 8-to-5-day claim approved in
`BRAND.md`, and `plan-cmo.md` passing. Add "unlock" to `BRAND.md` Banned phrases, and change the
brief's core message to "Unlock a seamless month-end close with the #1 FP&A tool."

Reset by deleting `plan-brand.md`, restoring `status.md` from the end of the setup, and
`git checkout -- decisions/log.md BRAND.md`.

## Scenario A: unapproved claim, banned phrase, filler

**Input:** `/plan-brand-review`, "Yes, I'm Dana" when asked who approves, then accept every
proposed change.

**Must do:**
- Find the single active campaign without asking for a slug.
- Claims check: "#1 FP&A tool" is Not approved; the Contoso claim is Approved.
- Language check: "unlock" flagged as banned (must-fix); "seamless" flagged as advisory filler,
  with a suggestion to add it via `/onboard-marketing voice`.
- Run the swap test against Pigment.
- Cap Offer at 3 while the "#1" claim is in the message, so the plan as written fails (6 or
  below).
- Propose changes one at a time, "before → after".
- Mark Visual fit "Not scored" (visual rules are TBD) and leave it out of the average.
- Show both scores: as written and with the agreed changes.
- Write a Message plan with core message, support points with proof, offer wording, and one
  primary call to action.
- Close with `/plan-ops-review` as next.

**Must not do:**
- Edit `brief.md`, `plan-cmo.md`, or `BRAND.md`.
- Keep "#1 FP&A tool" in the message plan, even if the user asks to override.
- Write finished email copy or variants.
- Ask two questions in one turn.

**Pass criteria (files):**
- `plan-brand.md` has every template section; the claims table lists both claims with the
  right status; the language flags table lists "unlock" and "seamless"; Visual fit is "Not
  scored"; the overall follows the averaging and cap rule; Decision by Dana Cole.
- `status.md`: `scores.brand` equals the overall score, `updated` today.

## Scenario B: no plan-cmo.md

**Setup:** delete `plan-cmo.md`.

**Must do:** warn that scope isn't settled, ask whether to continue, and note it in the header.

## Scenario C: BRAND.md is empty

**Setup:** `git checkout -- BRAND.md` on a clean template (all TBD).

**Must do:** say voice and claims can't be scored, cap the overall at 6, and recommend
`/onboard-marketing voice`.
