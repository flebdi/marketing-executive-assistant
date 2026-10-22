# Learnings

What this team has learned, one entry per lesson. Written by `/campaign-retro`, managed with
`/learnings`, and pulled automatically into new briefs.

Format:

```
## <short title>
- **Date:** YYYY-MM-DD
- **Campaign:** <slug, or "none" for a lesson from outside a campaign>
- **Tags:** channel:<email|linkedin|...> · audience:<persona> · tactic:<subject-line|offer|timing|...>
- **Lesson:** one or two sentences, specific enough to change a decision.
- **Evidence:** the numbers or observation behind it, with the source.
- **Confidence:** low | medium | high
```

Optional lines, added below Confidence when they apply:

- `- **Confirmed by:** <slug> (<evidence>)`: another campaign showed the same thing.
- `- **Contradicts:** <title>` / `- **Contradicted by:** <slug> (<evidence>)`: an open
  conflict, resolved with `/learnings prune`.
- `- **Last reviewed:** YYYY-MM-DD`: kept after a prune.

Confidence:

- **High:** a clear result in a controlled test with a decent sample, or the same pattern in
  2 or more campaigns.
- **Medium:** one campaign, a clear difference, few other explanations.
- **Low:** a small sample, several things changed at once, an interim result, or an
  observation without numbers.

Tags are lowercase with hyphens. Use channel names from `context/channels.md` and persona
names from `context/audiences.md`.

Entries are never deleted. `/learnings prune` moves retired ones under `# Archive` at the
bottom, with the date and reason.

---

<!-- Entries go below, newest first. -->
