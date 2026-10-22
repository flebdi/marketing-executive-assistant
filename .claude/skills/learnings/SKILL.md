---
name: learnings
description: The team's memory. Shows, searches, adds, prunes, and exports the tagged lessons in learnings/learnings.md that /campaign-retro writes and /campaign-office-hours pulls into new briefs. Use to find what the team knows about an audience, channel, or tactic ("/learnings search channel:email"), to find what applies to a campaign ("/learnings for 2026-11-ai-webinar"), to record a lesson from outside a retro ("/learnings add"), to clean up duplicates, conflicts, and stale entries ("/learnings prune"), or to share a summary ("/learnings export").
argument-hint: "[search <terms> | for <campaign slug> | add | prune | export]"
---

# /learnings

*Adapted from `/learn` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** The team's librarian. You keep the lessons findable, honest, and current, so the
next campaign starts from what the team already knows instead of from scratch.

**Stage:** Foundation (any time). Not tied to a campaign. **Gate:** none.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow sections 1, 4, and 7.

This skill isn't campaign-scoped, so preamble sections 2, 3, 5, and 6 don't apply. Instead:

- **It owns:** `learnings/learnings.md`, shared with `/campaign-retro` (which only appends).
  Read the format, optional lines, and confidence rules at the top of that file and follow
  them exactly.
- **It reads:** `context/channels.md` and `context/audiences.md` (tag names), and for
  `for <slug>`, that campaign's `brief.md`. It may read past campaigns' `retro.md` to check
  evidence.
- **It may write** `reports/learnings-<YYYY-MM-DD>.md` in export mode, only if the user asks
  for a file.
- **It never touches** campaign files, `context/`, `BRAND.md`, or `playbooks/`.

## 1. Rules

- **Never invent or upgrade evidence.** A lesson's evidence is what a retro, a test, or a
  person actually observed, with the source. Confidence follows the rules in
  `learnings/learnings.md`, not how sure the user feels.
- **Never delete.** Retired entries move under `# Archive` with the date and reason.
- **Every change needs approval.** Show the change, then write it. Mechanical fixes of the
  same kind (e.g. five tag spellings) can be approved together. Anything that changes what a
  lesson says or how confident it is gets approved one at a time.
- **Specific or nothing.** "Personalization works" and "video performs well" aren't lessons.
  A lesson names the audience, the channel, the tactic, and the effect.
- **Archived entries** are ignored by search, `for`, and export unless the user asks for them.

## 2. Read the file

Parse `learnings/learnings.md`: each entry is a `## <title>` block below the
`<!-- Entries go below, newest first. -->` line. Everything below `# Archive` is archived.
Note any entry that doesn't parse (missing fields, no date) for prune.

If there are no entries: say "No learnings yet. They're written by `/campaign-retro` after a
campaign, or added with `/learnings add`." and stop, unless the mode is `add`.

## 3. Modes

### Default (no argument): overview

Show:
- **Totals:** entries, by confidence (high, medium, low), archived count.
- **Coverage:** entries per channel tag and per audience tag. Name channels in
  `context/channels.md` and personas in `context/audiences.md` with no learnings yet.
- **Needs attention:** counts of what each `prune` check would find (broken entries, tag
  variants, duplicates, open contradictions, stale entries).
- **Most recent 5:** title, campaign, confidence, one-line lesson.

End by suggesting the next useful mode, e.g. `/learnings prune` if anything needs attention.

### `search <terms>`

Terms can be tags (`channel:email`, `audience:vp-finance`, `tactic:subject-line`) or words.

1. Tag terms match exactly (after lowercasing). Word terms match the title, lesson, and
   evidence. Several terms narrow the search: an entry must match all tag terms and at least
   one word term.
2. Rank by: number of tag matches, then confidence (high first), then confirmations, then
   date (newest first).
3. Show up to 10, each as: title, confidence, campaign and date, lesson, evidence in one line,
   and any open contradiction. If more matched, say how many and offer the rest.
4. If nothing matches, say so, and suggest the nearest tags that do exist.

### `for <campaign slug>`

What the team already knows that applies to one campaign. This is the same search
`/campaign-office-hours` runs, available on demand.

1. Read the campaign's `brief.md`. If it has none, ask for the persona, channels, and offer.
2. Turn it into tags: its channels, its persona, and its tactics (offer type, smallest test,
   timing).
3. Search with those tags. Show the top 5 as in `search`, each with one line on how it
   applies to this campaign, e.g. "The brief sends on Friday; this says Friday sends
   underperformed for this persona."
4. Flag any lesson the brief currently contradicts. Don't edit the brief: say that
   `/campaign-office-hours <slug>` can revise it.

### `add`

For lessons learned outside a retro: a test, a sales call pattern, a platform change.

1. **Check first.** Ask for the lesson in one sentence, then search for duplicates. If one
   exists, offer to add a `Confirmed by` line to it instead.
2. Ask one at a time, pushing back once on vague answers:
   - **Evidence:** "What did you see, and where? Numbers and the source if you have them."
     No numbers means an observation: record what was observed and who observed it.
   - **Tags:** propose channel, audience, and tactic tags from the context files; confirm.
   - **Campaign:** the slug, or `none`.
3. **Set confidence by the rules** in `learnings/learnings.md`, and explain the level. If the
   user wants it higher, ask what evidence would justify that. Without it, the level stays.
4. Show the full entry, get approval, and insert it directly below the
   `<!-- Entries go below, newest first. -->` line.

### `prune`

Find problems, then fix them one approval at a time. Run every check, show a numbered list
of everything found, then work through it.

1. **Broken entries:** missing fields, no date, evidence empty or `TBD` with confidence above
   low. Fix: fill from the source campaign's `retro.md` if it's there, ask the user, or lower
   the confidence to low.
2. **Tag hygiene:** spelling variants of one tag (`channel:e-mail` vs `channel:email`),
   uppercase, spaces, persona tags that don't match `context/audiences.md`. Fix: normalize
   (these can be approved as one batch).
3. **Duplicates:** two entries with the same lesson for the same audience and channel. Fix:
   keep the one with stronger evidence, turn the other into a `Confirmed by` line on it, and
   archive the other with "merged into <title>". Two campaigns agreeing can raise confidence
   by one level.
4. **Contradictions:** entries marked `Contradicts` or `Contradicted by`, or opposite lessons
   with the same tags. Show both with their evidence side by side, then ask which applies:
   - They're about different situations: narrow each lesson and its tags so both hold.
   - One has clearly stronger evidence: archive the weaker one ("superseded by <title>").
   - Can't tell: keep both, set both to low, and say what test would settle it.
5. **Stale:** low-confidence entries older than 6 months with no confirmation; any entry
   older than 18 months; entries tagged with a channel no longer in `context/channels.md`.
   Ask: keep (add `Last reviewed: <today>`), lower the confidence, or archive.

At the end, show what changed: counts per check, and entries archived.

### `export`

A shareable summary for the team or a new hire.

1. Include high and medium confidence by default (ask if they want low too).
2. Group by channel, then audience. Under each, write the lessons as plain guidance, e.g.
   "Do: name the event date in the subject line (high, 2 campaigns)." and "Avoid: ...".
   Keep the confidence and the number of campaigns behind each.
3. List open contradictions separately as "Not settled yet".
4. Show it in the chat. If the user wants a file, write
   `reports/learnings-<YYYY-MM-DD>.md`.

## 4. Close

End with:

1. **What changed**, if anything, with the path to `learnings/learnings.md` (and the export
   file, if written).
2. **What needs attention next:** open contradictions, gaps in coverage, or nothing.
3. **Next:** the lessons feed `/campaign-office-hours` automatically. After the next
   campaign, `/campaign-retro` adds more.
