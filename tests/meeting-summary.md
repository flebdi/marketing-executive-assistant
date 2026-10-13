# Test: /meeting-summary

Run in a fresh Claude Code session. Save the transcript below as
`transcripts/2026-10-12-q4-webinar-sync.txt`. Reset with
`git checkout -- decisions && git clean -fd transcripts` between runs.

## Scenario A: one transcript with real, fake, and reversed decisions

**Transcript** (fictional company, Northwind Analytics):

```
[00:00] Dana Cole: Thanks all. Two things: the November webinar and the nurture emails.
[00:45] Priya Shah: For the webinar, I'd go with the close-faster angle. Maybe a customer panel.
[01:30] Sam Ortiz: We could also try LinkedIn Live this time.
[02:10] Dana Cole: Let's keep it on Zoom. Agreed on the close-faster angle.
[03:05] Priya Shah: Date-wise, November 18th works.
[03:40] Sam Ortiz: That's the week of the product freeze. Can we do the 20th?
[04:15] Dana Cole: Fine, the 20th. Unless the panel guest can't make it, then the 25th.
[05:00] Priya Shah: I'll draft the invite email by Friday.
[05:30] Dana Cole: Someone needs to check if we can quote Contoso on the panel.
[06:20] Sam Ortiz: For nurture, we should probably cut it from five emails to three.
[06:50] Dana Cole: Let's revisit that once we see October numbers.
[07:30] Speaker 4: I'll set up the Zoom registration page.
```

**Input:** `/meeting-summary`

**Must do:**
- Find the one transcript without a summary and write
  `transcripts/summaries/2026-10-12-q4-webinar-sync.md`.
- Record as decisions: close-faster angle; Zoom, not LinkedIn Live; date 2026-11-20 with the
  condition (2026-11-25 if the panel guest can't make it). Each with a quote and timestamp.
- Record the date as the final 20th, not the 18th, noting the move because of the freeze.
- Record Priya's invite email as an action item due Friday 2026-10-16.
- Record "check if we can quote Contoso" as an open question or an action item with
  `TBD (needs: owner)`.
- Record the nurture cut (5 to 3) as an open question, not a decision.
- Keep "Speaker 4" as is and ask once who it is.
- Suggest a `decisions/log.md` entry for the webinar date and wait for approval.
- Close with paths, counts, and follow-ups (e.g. `context/calendar.md` for the webinar date).

**Must not do:**
- Treat Priya's "Maybe a customer panel" or Sam's nurture idea as decisions.
- Invent an owner for the Contoso check or the Zoom page, or a due date nobody said.
- Edit the transcript, `context/`, `campaigns/`, or `BRAND.md`.
- Append to `decisions/log.md` without approval, or change existing entries.

**Pass criteria (file):** header with meeting date 2026-10-12 and a link to the transcript;
a 3-to-6-sentence summary; a Key decisions table with 3 rows, each with evidence; an Action
items table; an Open questions list with the nurture question.

## Scenario B: nothing to do

**Input:** `/meeting-summary` again after Scenario A.

**Must do:** say every transcript already has a summary and list the latest ones.
**Must not do:** rewrite the existing summary without asking.

## Scenario C: no decisions

**Input:** a transcript that is only a brainstorm ("what if we…", "could we…").

**Must do:** write "No decisions were made." in Key decisions and list the ideas as open
questions or discussion notes.
