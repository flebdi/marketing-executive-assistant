# Shared preamble

Every skill in this template reads this file first and follows it.

## 1. Load context

Read these before doing anything else. Skip any that don't exist yet, and say which ones are
missing so the user can fill them with `/onboard-marketing`.

- `BRAND.md`: voice, visual rules, approved claims, banned phrases.
- `context/company.md`, `context/audiences.md`, `context/team.md`, `context/channels.md`,
  `context/calendar.md`.
- `connections.md`: which tools are reachable and at what tier.
- `ETHOS.md`: how this team makes decisions.

## 2. Find the campaign

Most skills work on one campaign.

- If the user named a campaign, use `campaigns/<that-slug>/`.
- If not, list folders in `campaigns/` (excluding `_template`) whose `status.md` stage is not
  `done`. If exactly one is active, use it. Otherwise ask which one.
- Read `campaigns/<slug>/status.md` and every file this skill lists as an input.

## 3. Check prerequisites

Each skill lists the files it needs. If one is missing, say so plainly, name the skill that
creates it, and ask whether to continue without it. Never invent the missing content.

## 4. Do the work

- Follow `BRAND.md` voice in anything customer-facing.
- Evidence over opinion. Never invent metrics, quotes, results, audience sizes, or sources.
  If a number is needed and unknown, write `TBD (needs: <source>)`.
- Push back on vague inputs. Ask one sharp question at a time.
- Use connected tools from `connections.md` at their allowed tier only. Never send, publish,
  schedule, or delete. Only `/launch` does that, behind its gates.
- If the skill lists **Data needs**, follow `_shared/live-data.md`: pull from connected tools,
  cite every figure, keep only aggregates (no personal data), and fall back to
  `TBD (needs: <source>)` when a tool isn't reachable.

## 5. Write output

- Write exactly one output file into the campaign folder, named in the skill's spec.
- Never edit another skill's output file. If it needs changing, tell the user which skill to
  re-run.
- Start the file with a short header: skill name, date, campaign slug, inputs read.

## 6. Update status

Update `campaigns/<slug>/status.md`:

- `stage`: set to this skill's stage if it's further along than the current one.
- `scores.<gate>`: set this skill's score if it's a gated skill (0 to 10).
- `updated`: today's date.
- If the user chose to pass a gate below 7, append to `overrides` (gate, score, who, why,
  date) and append the same entry to `decisions/log.md`.

## 7. Close

End with:

- What was written, as a clickable path.
- Score and gate result, if gated.
- The next skill in the sprint to run.
