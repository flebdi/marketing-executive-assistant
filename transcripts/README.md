# Transcripts

Meeting transcripts, and a summary of each one with the key decisions.

## How to use it

1. Drop a transcript in this folder. Name it `YYYY-MM-DD-<meeting-slug>.<ext>`, for example
   `2026-10-12-q4-campaign-kickoff.txt`.
   Accepted: `.txt`, `.md`, `.vtt`, `.srt`, `.docx`, `.pdf`.
2. Run `/meeting-summary` (all transcripts without a summary yet) or
   `/meeting-summary 2026-10-12-q4-campaign-kickoff` (one transcript).
3. The summary is written to `summaries/<same name>.md`.

## Rules

- Transcripts are the source record. No skill edits or deletes them.
- `/meeting-summary` owns `summaries/`. To change a summary, edit the transcript notes or
  re-run the skill.
- Decisions go into `decisions/log.md` only after you approve them.
- Transcripts can hold sensitive or personal information. Remove anything that shouldn't be
  stored before dropping it here, and don't commit this folder to a public repo.
