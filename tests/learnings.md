# Test: /learnings

Run in a fresh Claude Code session. Everything here is fictional (Northwind Analytics).

## Setup

1. Run the `/onboard-marketing` Scenario A answers, so `context/audiences.md` has the VP
   Finance persona and `context/channels.md` has Email and LinkedIn.
2. Copy `tests/fixtures/learnings/seeded.md` over `learnings/learnings.md`, keeping the
   format section from the real file at the top (or just copy it whole: the skill should
   still parse the entries below the `<!-- Entries go below... -->` line).

Reset with `git checkout -- learnings`.

## Scenario A: overview

**Input:** `/learnings`

**Must do:** show 6 entries (0 high, 4 medium, 2 low); coverage by channel and audience;
"needs attention" counts for the planted problems; the 5 most recent; and suggest
`/learnings prune`.

## Scenario B: search

**Input:** `/learnings search channel:email audience:vp-finance timing`

**Must do:**
- Return "Tuesday sends beat Friday sends" and "Friday sends work for finance leaders", and
  flag that they conflict.
- Match the tag variants only if it says it's treating `channel:e-mail` and
  `audience:VP Finance` as the same tags, and recommends `/learnings prune` to fix them.

**Must not do:** return archived entries, or entries without the timing word or tag.

## Scenario C: what applies to a campaign

**Setup:** a `campaigns/2026-11-month-end-webinar/brief.md` with persona VP Finance, channel
email, first send on a Friday, and a question as the draft subject line.

**Input:** `/learnings for 2026-11-month-end-webinar`

**Must do:** show the subject-line lessons and the timing lessons, each with one line on how it
applies; flag that the Friday send and the question subject line go against existing lessons;
point to `/campaign-office-hours 2026-11-month-end-webinar` to revise.

**Must not do:** edit the brief.

## Scenario D: prune

**Input:** `/learnings prune`, then approve each proposal.

**Must do:**
- List the problems found before changing anything, numbered.
- **Tags:** normalize `channel:e-mail` → `channel:email` and `audience:VP Finance` →
  `audience:vp-finance` (one batch approval is fine).
- **Duplicate:** merge "Dates in subject lines lift webinar signups" into "Name the date in
  webinar subject lines" as a `Confirmed by: 2026-04-forecasting-webinar (...)` line, offer to
  raise its confidence to high (two campaigns), and archive the other with "merged into".
- **Contradiction:** show the Tuesday and Friday entries side by side and ask which applies.
  Note that they measure different things (clicks vs opens), so narrowing both is a
  reasonable answer.
- **Broken:** the gated-recording entry has `Evidence: TBD` at medium. Ask for the evidence
  or lower it to low.
- **Stale:** the 2025-11 carousel entry is low confidence, older than 6 months, unconfirmed.
  Ask keep, lower, or archive.
- Move archived entries under `# Archive` with the date and reason. Never delete.
- End with counts of what changed.

**Must not do:** change a lesson's wording or confidence without approval, or delete any entry.

## Scenario E: add, with pushback

**Input:** `/learnings add`, then:

| Step | User says |
|---|---|
| Lesson | "Personalization works." |
| Lesson (after pushback) | "Using the company name in the first line of SDR follow-up emails got more replies from VP Finance." |
| Evidence | "Sam said it seemed to work better." |
| Tags | accept the proposal |
| Campaign | "none" |
| Confidence | "Make it high, I'm sure." |

**Must do:** push back on "Personalization works"; record the evidence as an observation by
Sam; propose tags like `channel:email · audience:vp-finance · tactic:personalization`; keep
confidence at low and say what evidence would raise it; insert the entry below the marker
after approval.

**Must not do:** set confidence to high, or invent numbers.

## Scenario F: export

**Input:** `/learnings export`, then "Yes, write a file."

**Must do:** group high and medium lessons by channel then audience as Do/Avoid guidance with
confidence; list open contradictions as "Not settled yet"; write
`reports/learnings-<today>.md`.

## Pass criteria

- After prune, every entry has all six fields, tags match the context files, and nothing
  was deleted: retired entries are under `# Archive` with a date and reason.
