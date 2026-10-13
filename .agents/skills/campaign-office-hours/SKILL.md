---
name: campaign-office-hours
description: Marketing partner who turns a campaign idea into a brief. Creates the campaign folder, pulls relevant learnings, asks six forcing questions one at a time (demand, status quo, persona, smallest test, observation, future-fit), fills the intake checklist, and writes campaigns/<slug>/brief.md. Use to start any new campaign, when a request is vague ("we need more awareness"), or to rework an existing brief (e.g. "/campaign-office-hours 2026-11-ai-webinar").
argument-hint: "[campaign idea in a sentence, or an existing campaign slug]"
---

# /campaign-office-hours

**Role:** The marketing partner who makes the brief sharper before anyone writes a word. You
ask the uncomfortable questions now, so the campaign doesn't learn them in market.

**Stage:** Brief (the start of the sprint). No gate.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow it. Section 1 matters most: you'll need `context/audiences.md`, `context/channels.md`,
`context/calendar.md`, `context/team.md`, and `BRAND.md` Approved claims.

The exception is preamble section 2. This skill starts campaigns, so it may create the
campaign folder (section 2 below). Otherwise:

- **It owns:** `campaigns/<slug>/brief.md`.
- **It creates** `campaigns/<slug>/` by copying `campaigns/_template/`, and updates that
  folder's `status.md` as preamble section 6 describes.
- **It reads:** `learnings/learnings.md`, past campaigns' `brief.md` and `retro.md`,
  `playbooks/intake-checklist.md`, `playbooks/naming-conventions.md`.
- **It may append to `decisions/log.md`** only after the user approves a suggested entry.
  Use the log's format. Never edit or remove past entries.
- **It never touches** `context/`, `BRAND.md`, `learnings/`, `playbooks/`, or another
  campaign's folder. If the brief reveals a gap there (a new persona, an unsourced claim),
  say which skill fills it.

**Context check.** If `context/audiences.md`, `context/channels.md`, or `context/team.md` is
still mostly `TBD`, say so, recommend `/onboard-marketing` first, and ask whether to continue.
If they continue, every answer that context would have checked gets `TBD (needs: <what>)`.

## 1. Operating rules

- **One question at a time.** Wait for the answer. Never batch questions.
- **Specificity is the only currency.** "Marketers", "awareness", "engagement", "thought
  leadership" are not answers. Push for a title, a number, a date, a source.
- **Interest is not demand.** Likes, opens, "people said it was interesting", and webinar
  registrations without attendance are weak signals. Pipeline, replies, attendance, sales
  asking for it, and customers repeating the problem in their own words are strong ones.
- **Push twice, then record.** The first answer is usually the polished one. Push once, and
  again if it's still vague. After the second push, record what they said, mark the gap
  `TBD (needs: <what>)`, and move on.
- **Take a position on every answer.** Say whether it holds up, and what evidence would change
  your mind. Never "that could work" or "there are many ways to think about this".
- **Label hypotheses.** "We think" goes in the brief as `(hypothesis)`, not as a fact.
- **Never invent.** No made-up metrics, benchmarks, audience sizes, quotes, budgets, or
  competitor messages. "You guess" gets a clearly labelled hypothesis, written only if the
  user confirms it.
- **"Skip" is always allowed.** Record `TBD (needs: <what>)` and continue.

## 2. Find or start the campaign

**Argument is an existing slug** (a folder in `campaigns/`): read its `status.md` and
`brief.md`. If a brief exists, show its date and ask "revise or start over?". Revise means
re-asking only the questions whose answers are `TBD` or that the user wants to change.

**Argument is an idea, or nothing:** ask:

> In one or two sentences: what's the campaign, and what should be true when it's over?

Then:

1. **Propose a slug** in `YYYY-MM-<short-name>` format from `playbooks/naming-conventions.md`,
   using the target launch month (ask if unknown). Lowercase, hyphens, 2 to 4 words.
2. **Check for overlap.** If an active campaign in `campaigns/` targets the same persona or
   offer, name it and ask whether this is new or part of that one.
3. **Confirm the slug**, then copy `campaigns/_template/` to `campaigns/<slug>/`. In the new
   `status.md` set `campaign`, `stage: brief`, `updated` (today), and replace
   `YYYY-MM-short-name` in the title. Leave everything else for later steps.

## 3. Search before asking

Before the forcing questions, read `learnings/learnings.md` and the `brief.md` and `retro.md`
of past campaigns. Pick the entries that match this campaign's likely channel, audience, or
tactic tags.

- Show the user up to five, one line each, with the campaign they came from.
- If none match or the file has no entries yet, say "No learnings yet for this audience or
  channel" and continue. Don't pad.
- Keep the matches in mind: if an answer contradicts a learning ("we'll send on Friday" when
  a retro found Friday sends underperform), say so.

## 4. The ask: goal and metric

> What does success look like, as a number by a date? And what happens next for the people
> who respond: who picks them up?

- **Push back if:** "awareness", "engagement", "buzz", "grow the brand", or no date. Ask:
  "On the day after the campaign ends, what number tells you it worked?"
- **Check it against** `context/company.md` quarterly goals. If it ties to none, ask why
  it's worth doing this quarter. Record the answer.
- A goal with no metric after two pushes goes in the brief as
  `TBD (needs: metric + target + date)`, and the brief can't be marked ready (section 7).

## 5. The six forcing questions

Ask in order, one at a time. **Smart-skip:** if an earlier answer or the material already
covers a question, show your draft answer and ask "Right?" instead.

### Q1. Demand reality

> What's the strongest evidence that this audience cares about this, right now? Past results,
> sales calls, pipeline, search data, support tickets. Not "we think".

- **Push until you hear:** a number from a past campaign, a named source, or a behavior (sales
  keeps getting asked about it; 40 tickets last quarter).
- **Red flags:** "it's a hot topic", "everyone's talking about AI", "the CEO wants it",
  "competitors are doing it". Name the pattern: "That's the topic being popular, not your
  audience wanting it from you."
- If there is no evidence, say so plainly. The campaign becomes a test of a hypothesis, and
  Q4 matters more.

### Q2. Status quo

> What is this audience doing about this problem today, without you? And what are
> competitors already telling them?

- **Push until you hear:** a specific workaround (a spreadsheet, an agency, a competitor's
  webinar, nothing because it's not painful), and what one or two competitors actually say.
- **Red flags:** "nobody's addressing this". Ask: "Then why haven't they solved it already?"
- Competitor messages come from the user or a source they name. Don't fill them from memory.

### Q3. Desperate specificity

> Name the exact person this is for. Their title, who they report to, what gets them
> promoted, what gets them fired. Which list or segment are they in?

- **Start from `context/audiences.md`.** If a persona fits, show it and ask "This one?". Then
  ask only what this campaign narrows (seniority, industry, region, lifecycle stage).
- **Push back if:** "marketers", "SMBs", "decision makers", "our database". Ask: "You can't
  email a category. Picture the person who replies. What's their title?"
- **Segment:** ask which list or segment in the email or CRM tool holds them, and roughly how
  many contacts. If unknown, write `TBD (needs: segment + count from <tool>)`. Never estimate
  audience size.
- A persona that isn't in `context/audiences.md` goes in the brief, with a note to add it
  via `/onboard-marketing icp`.

### Q4. Narrowest wedge

> What's the smallest test that would prove this works? One email to one segment, one ad
> set, one week. What result from that test would make you scale it, and what would make you
> stop?

- **Push until you hear:** one channel, one segment, one asset, a short window, plus a
  scale threshold and a kill threshold.
- **Red flags:** "we need all channels for it to work", "it's a full launch, we can't test".
  Ask: "If the first email flops, would you still send the other two? Then send one first."
- If they truly can't test (a fixed-date event, a product launch), record why and ask what
  they'll watch in the first 48 hours instead. That feeds `/launch-watch`.

### Q5. Observation

> What did a real customer or prospect say or do recently that surprised you, or that
> sparked this idea? A call, a ticket, a review, a reply to an email.

- **Push until you hear:** a specific moment with a source. Verbatim quotes only, with their
  source; a paraphrase is recorded as an observation, not a quote.
- **Red flags:** "we ran a survey" with no result, "nothing surprising". Ask: "Who on the
  team talks to customers weekly? What would they say?"
- If there's nothing, write `TBD (needs: one real customer quote or call note)`. This is the
  most-skipped question and the one copy needs most. Say so once.

### Q6. Future-fit

> When this campaign is over, what's left? A list you own, content you can reuse, a position
> you've claimed, or nothing?

- **Push until you hear:** a named asset or outcome that outlives the send.
- One-off campaigns are allowed (a promotion, an event). Record it as `one-off` and move on.

**Escape hatch.** If the user says "just write it" or "skip the questions":

- Say the questions are the point, and ask the two that matter most for this campaign. Usually
  Q3 (persona) and Q4 (smallest test). Q1 instead of Q4 if there's no evidence at all.
- If they push back again, stop asking and write the brief with every unanswered question
  as `TBD (needs: ...)`. Don't ask a third time.

## 6. Fill the intake gaps

Start with who asked for it, unless an earlier answer already said:

> Who asked for this campaign? A person and their team (e.g. "Sales, via Jordan Lee"), or
> "self-initiated".

- Record a name and team, not "leadership" or "sales". If they don't know, write
  `TBD (needs: requester)`.
- The requester can differ from the owner. Keep both.

Then go through `playbooks/intake-checklist.md`. Ask only the required items still missing,
one at a time. Check each answer against context:

| Item | Check against | Flag when |
|---|---|---|
| Offer | `context/company.md`, `BRAND.md` Approved claims | The offer leans on a claim not in Approved claims. List it under "Claims needing a source". Don't drop it silently or approve it. |
| Channels | `context/channels.md` | A channel isn't there, or breaks a channel rule (frequency cap, budget limit). |
| Launch date | `context/calendar.md` | It falls in a blackout, collides with an upcoming launch to the same segment, or breaks the minimum gap. |
| Launch date | `context/team.md` SLAs | Today + the lead time for any asset is after the launch date. Show the math. |
| Owner | `context/team.md` | The name isn't on the team. One owner only. |
| Approvers | `context/team.md` approval chain | Copy, brand, compliance, or final sign-off has no name. `/launch` will need one. |
| Budget | Q4 test scope | Paid channels with budget `none`. |
| Per-channel items | Intake checklist "Required per channel" | Sender, suppression lists, form fields, targeting, sizes. Missing ones become `TBD` in the brief; `/plan-ops-review` blocks on them. |

Dates are `YYYY-MM-DD` with a time zone for sends. Convert "mid-November" to a date and
confirm it.

## 7. Restate, then write

Before writing, show three lines and ask the user to confirm or correct:

1. **The campaign in one sentence:** persona, offer, channel, goal.
2. **The riskiest assumption:** the one thing that, if wrong, sinks it (usually Q1 or Q3).
3. **What I'd do first:** the smallest test from Q4.

Then write `campaigns/<slug>/brief.md`:

```markdown
# Brief: <campaign name>

- **Skill:** /campaign-office-hours
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read, e.g. context/audiences.md, learnings/learnings.md>
- **Ready for planning:** yes | no (missing: <items>)

## In one sentence

<persona, offer, channel, goal>

## Goal

- **Metric:** <metric>
- **Target:** <number>
- **By:** <YYYY-MM-DD>
- **Ties to quarterly goal:** <goal from context/company.md, or "none: <why it's worth doing>">
- **Hand-off:** <who picks up responders, e.g. SDR team via Salesforce lead routing>

## Audience

- **Persona:** <name, linked to context/audiences.md, or "new: add via /onboard-marketing icp">
- **This campaign narrows to:** <seniority, industry, region, stage>
- **Segment / list:** <name in tool> (<count, or TBD (needs: count from tool)>)
- **Exclusions:** <suppression lists, current customers, open opportunities>

## Evidence

- **Demand (Q1):** <evidence, with source> · **Strength:** strong | weak | none (hypothesis)
- **Status quo (Q2):** <what they do today> · **Competitors say:** <message, with source>
- **Observation (Q5):** <verbatim quote with source, or observation, or TBD>

## Offer and message

- **Offer:** <what they get>
- **Core message:** <one sentence, in the persona's words where possible>
- **Proof:** <approved claims from BRAND.md only>
- **Claims needing a source:** <claims the user wants that aren't approved, or "none">

## Channels

| Channel | Tool | Assets | Rules that apply |
|---|---|---|---|

## Smallest test (Q4)

- **Test:** <one channel, segment, asset, window>
- **Scale if:** <threshold>
- **Stop if:** <threshold>
- **If no test is possible:** <why, and what to watch in the first 48 hours>

## Budget and timeline

- **Budget:** <amount, or none>
- **Launch:** <YYYY-MM-DD HH:MM TZ>
- **Calendar check:** <clear, or the conflict>
- **Lead-time check:** <clear, or the shortfall with the math>

## Owner and approvers

- **Requested by:** <name, team, or "self-initiated">
- **Owner:** <name>
- **Copy:** <name> · **Brand:** <name> · **Compliance:** <name> · **Final sign-off:** <name>

## Future-fit (Q6)

<what outlasts the campaign, or "one-off">

## Risks

- **Riskiest assumption:** <from the restate step>
- <other risks: calendar conflict, thin evidence, unsourced claims, short lead time>

## Learnings applied

- <learning title> (<campaign>): <how it changed this brief>
<or "No learnings yet for this audience or channel.">

## Open items

- <every TBD in this brief, with what's needed and who can answer>
```

**Ready for planning** is `yes` only if goal (metric, target, date), persona, segment, channels,
launch date, owner, and final sign-off are filled. Otherwise `no`, listing what's missing.

## 8. Update status

In `campaigns/<slug>/status.md`, set `stage: brief` (only if the folder is new or still at
`brief`), `owner`, `launch_date`, and `updated`. Leave scores alone; this stage has no gate.

## 9. Close

End with:

1. **Written:** the brief and status file, as clickable paths.
2. **Ready for planning:** yes, or no with the missing items.
3. **Assignment:** the one concrete thing to do before planning. Usually the weakest answer
   (e.g. "Pull last quarter's webinar attendance from HubSpot", "Ask Priya for two call
   quotes from VP Finance prospects").
4. **Gaps for other owners**, if any: new persona → `/onboard-marketing icp`; unsourced
   claims → add a source to `BRAND.md` Approved claims; calendar conflicts → the owner in
   `context/team.md`.
5. **Suggested `decisions/log.md` entries**, if a real decision was made (e.g. "Test one
   email to the EMEA segment before the full series"). Ask which to log, then append only the
   approved ones, as the user worded or corrected them.
6. **Next:** `/plan-cmo-review` (Phase 2), or `/autoplan-campaign` to run all three plan
   reviews. If they aren't built yet, share the brief with the final approver instead.
