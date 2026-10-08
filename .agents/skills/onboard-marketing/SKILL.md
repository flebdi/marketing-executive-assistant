---
name: onboard-marketing
description: Chief-of-staff intake for a new marketing team. Asks 10 questions one at a time (company, offer, ICP, channels, team, approvers, tools, brand voice, send calendar, top pain) and fills context/*.md, BRAND.md, and the tool names in connections.md. Use when setting up this template for the first time, when context files are still TBD, or to update one area (e.g. "/onboard-marketing team").
argument-hint: "[area to update: company | offer | icp | channels | team | approvers | tools | voice | calendar | pain]"
---

# /onboard-marketing

**Role:** Chief of staff on your first day. You learn how this team works so every other skill
starts from facts, not guesses.

**Stage:** Foundation (runs before the sprint). Not tied to a campaign.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow sections 1, 4, and 7.

This skill is not campaign-scoped, so preamble sections 2, 3, 5, and 6 don't apply. Instead:

- **It owns:** `context/company.md`, `context/audiences.md`, `context/team.md`,
  `context/channels.md`, `context/calendar.md`.
- **It co-owns `BRAND.md`** with `/brand-system`. This skill fills Company, Voice, Tone by
  channel, Banned phrases, Required elements, Voice samples, and Approved claims (sourced
  only). It leaves Visual rules as TBD unless the user gives exact values.
- **It may edit `connections.md`** only to change tool names in the Registry table to match
  the team's stack. It never sets a tool's status to `connected`. That needs a working test
  call, which happens when the connection is set up.
- **It never touches** `campaigns/`, `learnings/`, `playbooks/`, or `decisions/log.md`
  (it suggests log entries instead).

## 1. Choose the mode

Read all five `context/` files, `BRAND.md`, and `connections.md`. Then pick one:

| Situation | Mode |
|---|---|
| An argument names an area (e.g. `team`) | **Update:** ask only that question (section 4). |
| Every file is still mostly `TBD` | **Fresh:** all 10 questions in order. |
| Some sections are filled, some `TBD` | **Resume:** show a one-line-per-question checklist (filled / partly / TBD) and start at the first question that isn't filled. |
| Everything is filled | Say so, show the checklist, and ask which area to update. |

## 2. Search before asking

Before question 1 (fresh mode only), ask once:

> Before I ask anything: do you have material I can read first? A website URL, a pitch deck,
> a brand or style guide, a positioning doc, past emails, an org chart. Paste paths or links,
> or say "none".

- Read what they give you (files with Read; URLs with a web fetch tool if one is available,
  otherwise ask them to paste the text).
- For each question below, if the material already answers it, show your draft answer and
  ask "Right? Anything to fix?" instead of asking from scratch. A confirmation counts as the
  answer. The user's correction always wins over the document.
- Note the source of every fact you take from a document. It goes into the file.

## 3. Ask the 10 questions

Rules for every question:

- **One question at a time.** Wait for the answer. Never batch questions.
- **Push back once on vague answers** (rules below each question). If the second answer is
  still vague, record what they said, mark the gap `TBD (needs: <what>)`, and move on.
- **"Skip" is always allowed.** Write `TBD (needs: <what's missing>)` and continue.
- **Never invent.** No made-up competitors, personas, quotes, metrics, prices, dates, owners,
  or claims. If the user says "you guess", offer a clearly labelled hypothesis and only write
  it if they confirm it, marked `(hypothesis, unconfirmed)`.
- **Write after each answer**, so an interrupted run loses nothing. After writing, show a
  two- or three-line summary of what changed and in which file.
- **Don't overwrite silently.** If a section already has non-TBD content, show it and ask
  "keep, replace, or add?" before writing.
- **Keep the templates' structure.** Replace `TBD`s and fill table rows. Keep the HTML
  guidance comments. Add rows or persona sections as needed. Set `BRAND.md` "Last updated"
  to today's date whenever you edit it.

### Q1. Company

> What does the company do, in one sentence a customer would say? What category do buyers put
> you in, and who do you lose deals to most?

- **Fills:** `context/company.md` (name, website, one-liner, category, competitors table).
  `BRAND.md` **Company** line.
- **Push back if:** the one-liner is jargon ("an AI-powered platform that empowers…"). Ask:
  "How would a customer describe you to a colleague?"
- **Competitors:** fill "how they position" only from what the user says or a source they
  give. Leave "where we win / where they win" as `TBD` rather than guessing.

### Q2. Offer

> What do you sell, to whom, at roughly what price, and what outcome does the buyer get? What
> proof do you have that it works, and where does that proof come from?

- **Fills:** `context/company.md` "What we sell" table, main differentiator, proof points.
  `BRAND.md` **Approved claims**.
- **Push back if:** the outcome is a feature ("dashboards") instead of a result ("close the
  books 3 days faster"). Ask: "What changes for the customer after they buy?"
- **Claims rule:** a claim goes into `BRAND.md` Approved claims only with a named source (a
  case study, a report, an analyst note, internal data with an owner). Claims without a source
  go into `company.md` proof points marked `(unsourced, not approved for use)`. Ask for the
  expiry date of time-bound claims ("#1 on G2 in Q3 2026").

### Q3. Ideal customer and persona

> Who is the ideal customer company (size, industry, region, buying trigger)? Then the main
> buyer: their title, who they report to, what gets them promoted, what gets them fired, and
> their top three pains. Do you have any real quotes from them?

- **Fills:** `context/audiences.md` ICP and one persona section per persona.
- **Push back if:** "everyone", "SMBs", "marketers", or no title. Ask: "Picture the last deal
  you won. What was the buyer's exact title, and why did they buy?"
- **Quotes rule:** verbatim only, with a source (call recording, ticket, review, survey). A
  paraphrase is recorded as a pain, not a quote. If none exist, write
  `TBD (needs: 3 verbatim quotes from calls, tickets, or reviews)`.
- One persona is enough to finish. Offer to add a second persona after Q10.

### Q4. Channels

> Which channels do you actually use today (email, paid social, organic social, webinars,
> events, SEO, partners)? For each one, any rules: send limits, frequency caps, suppression
> lists, budgets? And which regions do you market to?

- **Fills:** `context/channels.md` table (Channel, Rules) and Compliance by region. Remove
  rows for channels they don't use, and add rows for ones they do.
- **Push back if:** they list a channel with no rules. Ask: "Is there a limit on how often one
  contact hears from you?" If they truly have none, write `none set` (that's a fact, not a TBD).
- **Compliance:** add EU/UK or Canada lines only if they market there. Record their stated
  consent basis. Don't give legal advice; if they're unsure, write
  `TBD (needs: confirm with legal)`.

### Q5. Team

> Who's on the marketing team? For each person: name, role, what they own, and how to reach
> them (Slack handle or email).

- **Fills:** `context/team.md` team table (Name, Role, Owns, Slack / email). Leave the
  "Approves" column for Q6.
- **Push back if:** a channel from Q4 has no owner. Ask who owns it.
- Don't record personal phone numbers or home addresses. Work handles only.

### Q6. Approvers

> Who has to approve copy, brand and creative, compliance or legal, and the final launch? And
> what lead time do you need for an email send, a landing page, and a paid campaign?

- **Fills:** `context/team.md` "Approves" column, Approval chain, and SLAs.
  `context/channels.md` Owner column (from Q5 and Q6).
- **Push back if:** "whoever's around" or nobody for final launch sign-off. Say why it
  matters: `/launch` needs a named person to confirm a send. Ask who that is.

### Q7. Tools

> Which tools do you use for email, landing pages and forms, CRM, tasks, web or dev requests,
> analytics, and team chat? The default here is HubSpot, Salesforce, Asana, Jira, GA4, and
> Slack. Tell me what's different.

- **Fills:** `context/channels.md` Tool column. `connections.md` Registry tool names.
- **connections.md rules:** rename or add rows to match their stack, update "Used for", and
  point "Reference" to `references/<tool>.md`. Keep Status as `not connected`. Keep Tier at
  the safest level that fits (read-only tools at 1; task tools at 2; sending only at 3 via
  `/launch`).
- **Never** ask for API keys, tokens, or passwords. If the user pastes one, don't write it
  anywhere, tell them to rotate it, and point them to `.env.example`.
- If the stack differs from the default, suggest a `decisions/log.md` entry
  (e.g. "Swapped Asana for ClickUp").

### Q8. Brand voice

> Paste two or three real pieces you're proud of: an email, a LinkedIn post, a landing page.
> Then tell me any words or phrases you never use, and what your email footer must include.

- **Fills:** `BRAND.md` Voice samples (verbatim, with where each came from), Voice table,
  Tone by channel, Banned phrases, Required elements.
- **Derive, then confirm.** From the samples, propose 3 to 5 voice traits, each with a "this"
  example quoted from their samples and a "not that" counter-example. Propose tone and length
  per channel from what the samples show. Ask them to confirm or edit before writing.
- **Push back if:** they describe the voice in adjectives only ("friendly but professional").
  Every brand says that. Ask for a real sample. Adjectives without samples are written as
  traits marked `(needs: a real sample)`.
- **Banned phrases:** record theirs. Offer, don't impose, a starter list of AI-sounding
  filler ("unlock", "supercharge", "game-changer", "seamless", "in today's fast-paced
  world"). Add only the ones they accept.
- **Visual rules:** if they mention exact hex codes or fonts, record them. Otherwise leave
  TBD and say `/brand-system` will fill them from their brand assets.

### Q9. Send calendar

> When do you prefer to send (days, times, time zone)? What's the most one contact should
> hear from you in a week? Any blackout dates coming up (holidays, quiet periods, product
> freezes), and what launches are already planned?

- **Fills:** `context/calendar.md` send rules, blackout dates, upcoming launches.
- **Push back if:** no time zone. Ask for it. Times without a zone can't be scheduled.
- Write dates as `YYYY-MM-DD`. If they say "Thanksgiving week", convert it to dates and
  confirm.

### Q10. Top pain and goals

> What's the one thing that most slows your marketing down right now? And what are this
> quarter's marketing goals, each with a metric, a target, and a date?

- **Fills:** `context/company.md` "This quarter's marketing goals". Add a
  `## Top marketing pain` section under it with their answer, in their words.
- **Push back if:** a goal has no metric ("more awareness", "grow the brand"). Ask: "How will
  you know on the last day of the quarter whether you hit it?" Goals without a metric,
  target, and date are recorded with `TBD (needs: metric + target + date)`.
- **Map the pain to a skill.** Tell them which skill in this template addresses it first
  (e.g. "launches slip on QA" → `/campaign-qa`; "briefs are vague" → `/campaign-office-hours`;
  "we repeat mistakes" → `/campaign-retro` and `/learnings`).

## 4. Update mode

When run with an area argument, map it to its question (company Q1, offer Q2, icp Q3,
channels Q4, team Q5, approvers Q6, tools Q7, voice Q8, calendar Q9, pain Q10). Show the
current content of the sections that question fills, ask the question, and write only those
sections. Skip section 2 (document search) unless the user offers material.

## 5. Close

After the last question (or when the user stops), give:

1. **Files updated**, as clickable paths.
2. **Coverage checklist:** each of the 10 areas marked filled / partly / TBD, with the
   specific gaps (e.g. "audiences.md: no verbatim quotes yet").
3. **Top 3 gaps that will hurt the first campaign**, in priority order. Missing approvers,
   missing time zone, and an empty Approved claims table usually matter most.
4. **Suggested `decisions/log.md` entries**, if any (stack swaps, compliance basis).
5. **Next:** `/campaign-office-hours` to brief the first campaign. If brand assets exist,
   `/brand-system` (once available) fills the visual rules.
