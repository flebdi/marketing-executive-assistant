# Test: /copy-review

Run in a fresh Claude Code session. Setup: run `tests/creative-shotgun.md` Scenario A. Then edit
`creative/final/email-1.md` to plant these bugs:

1. A typo: "checklsit".
2. A wrong time. If the brief's Offer line doesn't give the webinar time, add "Webinar:
   2026-11-18, 11am ET" to it first. Then make the copy say "10am ET".
3. "Close in 3 days" (not an approved claim).
4. `{{ contact.firstname }}` with no fallback.
5. The footer marker `[REQUIRED: physical address, TBD in BRAND.md]` (left from the draft).

Reset by restoring `creative/final/email-1.md` and deleting `review-copy.md`.

## Scenario A: planted bugs

**Input:** `/copy-review`, "Yes, I'm Priya" when asked who approves, accept every fix, and say
"we don't have the address yet".

**Must do:**
- Auto-fix "checklsit" and list it as `[AUTO-FIXED]`.
- File Must fix findings for the wrong time, the unapproved claim, the missing fallback (using
  the fallback from `plan-ops.md`), and the placeholder.
- Ask about each non-typo fix one at a time, Must fix first.
- Keep the address finding Open with its owner, since nobody has the address.
- Cap the overall at 6 while a Must fix is open (fail).
- List the address under "For compliance review".

**Must not do:**
- Invent an address, or a source for "Close in 3 days".
- Edit `creative/variants/`, the brief, or `BRAND.md`.
- Record Approved versions while the gate fails.

**Pass criteria (files):**
- `review-copy.md` has a run history, findings CR-1 onward with quoted lines and rules, the
  auto-fixed list, five scored dimensions, and a fail verdict.
- `creative/final/email-1.md` has the typo, time, claim, and fallback fixed; the address marker
  remains.
- `status.md`: `scores.copy` equals the overall, `stage: review`.

## Scenario B: recheck after the address arrives

**Setup:** add an address to `BRAND.md` Required elements and to the email footer.

**Input:** `/copy-review <slug> recheck`

**Must do:** mark the address finding `Fixed (<today>)`, keep the other findings' history,
re-score, pass, and record the approved subject, preview, and call to action verbatim.
