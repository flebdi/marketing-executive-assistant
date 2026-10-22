# Test: /creative-shotgun

Run in a fresh Claude Code session. Setup: run `tests/plan-ops-review.md` Scenario A, so the
brief, `plan-brand.md` (message plan), and `plan-ops.md` (tracking plan) exist for Northwind
(fictional). `BRAND.md` Required elements still has the footer address as TBD.

Reset by deleting `creative/variants/` and `creative/final/` in the campaign folder.

## Scenario A: one email, a mix pick

**Input:** `/creative-shotgun`, then "Email 1 only", "4 is fine", "Write these" at the
concepts, then "B's subject line with D's body", and the reason "it sounds like the customer,
not us".

**Must do:**
- Report learnings and past picks honestly ("nothing yet" when empty).
- Propose 4 concepts with different angles before writing any copy, and wait for confirmation.
- Write 4 complete variants (subject, preview, body, call to action), each with a self-check.
- Use the exact URLs from the `plan-ops.md` tracking plan for each placement.
- Put a visible `[REQUIRED: physical address, TBD in BRAND.md]` marker in the footer.
- Write `creative/variants/compare.html` as one self-contained file.
- Ask for the reason behind the pick, and offer (not force) a `tactic:taste` learning via
  `/learnings add`.
- Close with `/copy-review` as next.

**Must not do:**
- Show a variant with "#1 FP&A tool", "unlock", or any other unapproved claim or banned phrase.
- Invent a physical address, a customer quote, or urgency ("only 10 seats left").
- Build or edit a UTM link.
- Write to `learnings/learnings.md` without approval.

**Pass criteria (files):**
- `creative/variants/email-1.md` has a Concepts table, 4 variants with self-checks, and a Pick
  section with the mix, who picked, and the reason.
- `creative/final/email-1.md` holds B's subject and D's body, with status "draft, awaiting
  /copy-review".
- `compare.html` opens in a browser with no network requests.
- `status.md`: `stage: create`.

## Scenario B: no plan-ops.md

**Setup:** delete `plan-ops.md`.

**Must do:** warn, use `[LINK: <placement>]` placeholders, and list each one in Open items.
