# Marketing Executive Assistant

> **Status:** v0, in development. Commands marked *coming soon* are on the roadmap in
> `PLAN-marketing-executive-assistant.md` and not built yet.

A Claude Code template that gives a marketing team a virtual campaign team: a strategist, a
CMO reviewer, a brand lead, an ops lead, a creative director, an editor, a compliance officer,
a QA lead, and a retro lead. Each one is a slash command. Together they take a campaign from
a rough idea to a reviewed, tested launch, then turn the results into lessons for the next
campaign.

It doesn't replace your team or your tools. It does the prep, the checking, and the
paperwork, so your people spend their time on judgment calls.

## Who it's for

- **CMOs and VPs of Marketing** who want every campaign to go through the same
  review gates without sitting in every review themselves.
- **Heads of demand gen, growth, or content** who own campaigns from brief to results.
- **Marketing ops leads** who own segments, tracking, UTMs, CRM, and QA.
- **Small teams, or one marketer doing everything**, who need the rigor of a full team
  without having one.

You don't need to code. You need Claude Code and a one-time setup interview (Part 1 below).

## What it does for you

| Problem | What the assistant does |
|---|---|
| Vague requests ("we need more awareness") | Asks six forcing questions until there's a measurable goal, a real audience, and a smallest test |
| Plans that skip strategy, brand, or ops | Three plan reviews, each scored 0 to 10. A plan needs a 7 to move on |
| Off-brand or unsupported copy | Checks every claim against your approved claims and every word against your banned phrases |
| Broken links, missing UTMs, bad tokens | Link checker plus real-browser QA. Zero open blockers before launch |
| Compliance surprises | Checks CAN-SPAM, CASL, GDPR, consent, and claims. Pass or fail |
| Retros that never happen, lessons that get lost | Every campaign ends with 1 to 3 tagged learnings that future briefs pull in automatically |
| An irreversible send going wrong | Nothing is sent or published without every gate passing and a person typing a confirmation |

## See a filled-in example: Northwind Analytics

The template ships blank (`TBD`) so your team can fill it in. To see what it looks like
filled in, open [examples/northwind/](examples/northwind/). It's a complete set of files for
**Northwind Analytics, a fictional B2B SaaS company**. Every person, email address, number,
and quote in it is made up.

| Example file | What it shows |
|---|---|
| [BRAND.md](examples/northwind/BRAND.md) | Voice traits, tone per channel, an approved claim with source and expiry, banned phrases, voice samples |
| [context/](examples/northwind/context/) | Company, audience and persona, team and approvers, channels, send calendar |
| [decisions/log.md](examples/northwind/decisions/log.md) | A logged campaign decision |
| [campaigns/2026-11-year-end-close/](examples/northwind/campaigns/2026-11-year-end-close/) | A campaign partway through the sprint: brief, CMO review, first email draft, and a QA report |

The [example's README](examples/northwind/README.md) walks through each file and shows how to
run the skills against Northwind in a scratch copy of the repo.

---

## Roadmap: how to use it

There are three parts. Set up once, run the sprint for each campaign, and let the routines
keep things moving between campaigns.

```
SET UP ONCE          RUN FOR EVERY CAMPAIGN                                    ALWAYS ON
─────────────        ─────────────────────────────────────────────────────    ──────────────
/onboard-marketing → Brief → Plan → Create → Review → QA → Launch → Watch → Retro   /learnings
connect tools                                                                       routines
```

### Part 1: Set up once

1. **Get the template.** Clone or download this folder and open it in VS Code (or any
   terminal) with [Claude Code](https://claude.com/claude-code) running.
2. **Run `/onboard-marketing`.** It asks 10 questions, one at a time: company, offer, ideal
   customer, channels, team, approvers, tools, brand voice, send calendar, and your biggest
   marketing pain. It fills in `context/`, `BRAND.md`, and the tool names in
   `connections.md`. Anything you don't know yet stays `TBD (needs: ...)` so nothing is
   made up.
3. **Fill the gaps in `BRAND.md`.** The most important sections are **Approved claims**
   (with a source and an expiry date for each), **Banned phrases**, and **Voice samples**
   (2 or 3 real pieces you're proud of). The review skills can only be as strict as this file.
4. **Connect your tools (optional).** Copy `.env.example` to `.env` and add the tokens for
   the tools you want the assistant to read. Mark each one `connected` in `connections.md`.
   Without connections, every skill still works: it asks you to paste or drop in an export
   instead.
5. **Read `ETHOS.md`.** One page. It's how the assistant makes decisions, and you can
   rewrite it to match how your team works.

> Tip: re-run one part of onboarding any time, for example `/onboard-marketing team` after a
> hire.

> Not sure what a good answer looks like? Compare with the matching file in
> [examples/northwind/](examples/northwind/) (see
> [See a filled-in example](#see-a-filled-in-example-northwind-analytics)).

### Part 2: Run the sprint for every campaign

Run the commands in this order. Each one reads what the previous ones wrote and saves exactly
one file in `campaigns/<YYYY-MM-slug>/`. If a step fails its gate, fix the issue and re-run
that step before moving on.

| # | Stage | Command | Role | What you do | It writes | Gate to move on |
|---|---|---|---|---|---|---|
| 1 | **Brief** | `/campaign-office-hours <your idea>` | Marketing partner | Answer six questions about demand, status quo, audience, smallest test, what you'd observe, and future fit | `brief.md` (and creates the campaign folder) | A measurable goal with a date |
| 2 | **Plan** | `/plan-cmo-review <slug>` | CMO | Agree on scope: expand, selective expand, hold, or reduce | `plan-cmo.md` | Score 7+ |
| 3 | **Plan** | `/plan-brand-review <slug>` | Brand lead | Agree on claim and message fixes one at a time | `plan-brand.md` (the message plan) | Score 7+ |
| 4 | **Plan** | `/plan-ops-review <slug>` | Marketing ops lead | Confirm segments, suppressions, tracked links, CRM setup, and dates | `plan-ops.md` (the QA test plan and launch settings) | Score 7+ |
| 5 | **Create** | `/creative-shotgun <slug> <asset>` | Creative director | Compare 4 to 6 directions side by side and pick one (or a mix, or an A/B pair) | `creative/variants/`, `creative/final/` | You pick |
| 6 | **Review** | `/copy-review <slug>` | Senior editor | Approve any change beyond typo fixes | `review-copy.md` | Score 7+ |
| 7 | **Review** | `/compliance-review <slug>` | Compliance officer | Send judgment calls to your named legal approver | `review-compliance.md` | Pass |
| 8 | **QA** | `/campaign-qa <slug>` | QA lead | Share previews and test sends; fix what it files; re-run with `recheck` | `qa-report.md` | Zero open blockers |
| 9 | **Launch** | `/launch <slug>` *(coming soon)* | Launch manager | Type the confirmation | `launch.md` | Every gate passed + your typed confirmation |
| 10 | **Watch** | `/launch-watch <slug>` *(coming soon)* | Campaign analyst | Act on alerts in the first 24 to 48 hours | `watch.md` | — |
| 11 | **Retro** | `/campaign-retro <slug>` | Marketing manager | Confirm the results and the lessons | `retro.md` + new entries in `learnings/learnings.md` | — |

**Your slug** is the campaign's folder name, for example `2026-11-month-end-webinar`.
`/campaign-office-hours` proposes one in step 1 and every later command takes it.

**Shortcuts and re-runs**
- `/autoplan-campaign <slug>` *(coming soon)* runs steps 2 to 4 in order with sensible
  defaults, for when you don't want to go back and forth.
- Re-run any step when its inputs change. Changed the audience? Re-run `/plan-ops-review`.
  Edited the email after QA? Re-run `/campaign-qa <slug> recheck`.
- Need another creative round for one asset? `/creative-shotgun <slug> email-2`.
- A gate can be overridden, but only by a person, with a reason. The override is logged in
  `status.md` and `decisions/log.md`, and `/campaign-retro` checks later whether it was the
  right call.

### Part 3: Always on

| Command or routine | When to use it |
|---|---|
| `/learnings` | `/learnings search channel:email`, `/learnings for <slug>`, `/learnings add`, `/learnings prune`, `/learnings export` |
| `/meeting-summary` | Drop a transcript in `transcripts/`, get decisions, action items, and open questions |
| `/campaign-retro week` | A weekly read across all active campaigns |
| `node scripts/due.mjs` | What's due today: QA re-checks, launches at risk, stuck campaigns, retros due, expiring claims |
| Routines (`routines/`) | Run the daily launch check, weekly retro, and monthly hygiene on a schedule, even when nobody remembers. See [routines/README.md](routines/README.md) |
| `/brand-system`, `/audit` *(coming soon)* | Build out `BRAND.md` from brand assets; score how well the assistant knows your team and tools |

---

## Command reference

What each command does, when to use it, and how to call it. The examples use a fictional
campaign, `2026-11-month-end-webinar`. Replace it with your own campaign's slug.

### Setup and memory

#### `/onboard-marketing`
**What it does:** Interviews you with 10 questions, one at a time (company, offer, ideal
customer, channels, team, approvers, tools, brand voice, send calendar, biggest pain), and
fills `context/`, `BRAND.md`, and the tool names in `connections.md`.
**When to use it:** The first time you set up the template, when files still say `TBD`, or
when one area changes (a new hire, a new tool, a new quarter).
```text
/onboard-marketing                 # full setup interview
/onboard-marketing team            # just update the team and approvers
/onboard-marketing voice           # redo brand voice and samples
```

#### `/learnings`
**What it does:** Searches, adds, cleans up, and exports the team's tagged lessons in
`learnings/learnings.md`. Retros write to it, and new briefs read from it.
**When to use it:** Before planning ("what do we know about LinkedIn ads?"), to record a
lesson learned outside a retro, or once a month to remove duplicates and stale entries.
```text
/learnings search channel:email
/learnings for 2026-11-month-end-webinar     # lessons that apply to this campaign
/learnings add                               # record a lesson by hand
/learnings prune                             # merge duplicates, flag conflicts and stale ones
/learnings export                            # shareable summary in reports/
```

#### `/meeting-summary`
**What it does:** Reads a transcript in `transcripts/` and writes its key decisions, action
items, and open questions to `transcripts/summaries/`.
**When to use it:** After a kickoff, planning meeting, or stakeholder call, so decisions
don't get lost. Drop the transcript file in `transcripts/` first.
```text
/meeting-summary 2026-10-12-q4-kickoff     # one transcript
/meeting-summary                           # every transcript that has no summary yet
```

### The campaign sprint (run in this order)

#### 1. `/campaign-office-hours`
**What it does:** Acts as your marketing partner. Creates the campaign folder, pulls in
relevant learnings, and asks six forcing questions: demand, status quo, persona, smallest
test, observation, and future fit. Pushes back on vague answers. Writes `brief.md`.
**When to use it:** To start any new campaign, especially when the request is vague ("we
need more awareness"), or to rework a brief that changed.
```text
/campaign-office-hours webinar on faster month-end close for VP Finance
/campaign-office-hours 2026-11-month-end-webinar     # rework an existing brief
```

#### 2. `/plan-cmo-review`
**What it does:** Reviews the brief like a CMO. Checks fit with this quarter's goals,
recommends a scope mode (expand, selective expand, hold, or reduce), stress-tests the plan,
and scores it 0 to 10. Writes `plan-cmo.md`.
**When to use it:** Right after the brief, or again when the brief changes. Pass a mode if
you already know you want to grow or cut the scope.
```text
/plan-cmo-review 2026-11-month-end-webinar
/plan-cmo-review 2026-11-month-end-webinar reduce    # force a smaller scope
```

#### 3. `/plan-brand-review`
**What it does:** Reviews the message before any copy exists. Checks every planned claim
against `BRAND.md`, flags banned phrases and AI-sounding filler, scores six brand dimensions,
and agrees fixes with you one at a time. Writes `plan-brand.md`, the message plan the
creative is built from.
**When to use it:** After the CMO review, or when the message or offer changes.
```text
/plan-brand-review 2026-11-month-end-webinar
```

#### 4. `/plan-ops-review`
**What it does:** Reviews the plan like a marketing ops lead. Checks segments and
suppressions, consent, CRM campaign and lead routing, every tracked link (built with the UTM
builder), forms, the schedule against your calendar and SLAs, and tasks and tickets. Writes
`plan-ops.md`, which holds the QA test plan and the launch settings.
**When to use it:** After the brand review, or whenever the audience, links, or dates change.
```text
/plan-ops-review 2026-11-month-end-webinar
```

#### 5. `/creative-shotgun`
**What it does:** Drafts 4 to 6 genuinely different directions for one asset, checks each
against `BRAND.md`, and lays them out side by side. You pick a winner, a mix, or an A/B pair.
Your pick and the reason are saved to `creative/final/`.
**When to use it:** After the ops review, once per asset. Run it again for another round on
one asset.
```text
/creative-shotgun 2026-11-month-end-webinar email-1
/creative-shotgun 2026-11-month-end-webinar lp-hero    # landing page hero
/creative-shotgun 2026-11-month-end-webinar ad-a       # one ad
```

#### 6. `/copy-review`
**What it does:** Edits the final copy like a senior editor. Checks every fact against the
brief and ops plan, every claim against Approved claims, personalization tokens and
fallbacks, placeholders, the call to action, voice, and length per channel. Fixes typos
itself and asks before any other change. Scores 0 to 10 and records the approved subject
lines and CTAs that QA checks against. Writes `review-copy.md`.
**When to use it:** After you've picked the final creative, and again after any copy edit.
```text
/copy-review 2026-11-month-end-webinar
/copy-review 2026-11-month-end-webinar recheck    # after you've made fixes
```

#### 7. `/compliance-review`
**What it does:** Checks email law for each region in the audience (CAN-SPAM, CASL, GDPR,
PECR), consent coverage, forms and privacy, claim substantiation, testimonials, image rights,
ad policies, and the required elements in `BRAND.md`. Any hard fail blocks the campaign.
Judgment calls go to your named legal approver. Pass or fail. Writes `review-compliance.md`.
Not legal advice.
**When to use it:** After the copy review and before QA, and again after a fix.
```text
/compliance-review 2026-11-month-end-webinar
/compliance-review 2026-11-month-end-webinar recheck
```

#### 8. `/campaign-qa`
**What it does:** Tests every email, landing page, link, form, and tracking tag against the
QA checklist and the ops plan, using the link checker and a real browser. Files each problem
with a severity, an owner, and steps to reproduce. Writes `qa-report.md`. The gate is zero
open blockers.
**When to use it:** After compliance passes and before launch, after every fix, and any time
an asset changes after QA has passed.
```text
/campaign-qa 2026-11-month-end-webinar
/campaign-qa 2026-11-month-end-webinar recheck    # re-test only what was fixed
```

#### 9. `/launch` *(coming soon)*
**What it does:** The only command allowed to send or publish. Refuses unless every gate has
passed or a person has logged an override. Shows a final summary (audience size, send time,
links, owner) and waits for a typed confirmation. Then it schedules the send, updates your
task tracker and CRM, and writes `launch.md`.
**When to use it:** Once QA shows zero open blockers. Until it ships, send by hand in your
email tool and note the send time in `status.md`.
```text
/launch 2026-11-month-end-webinar
```

#### 10. `/launch-watch` *(coming soon)*
**What it does:** Checks the campaign 2, 24, and 48 hours after the send: bounces, spam
complaints, deliverability, broken links, form errors, and click rates far off plan. Alerts
the owner and the final approver if a stop condition from `plan-ops.md` is met. It never
stops a send by itself. Writes `watch.md`.
**When to use it:** `/launch` schedules it automatically. Run it by hand for an extra check.
```text
/launch-watch 2026-11-month-end-webinar
```

#### 11. `/campaign-retro`
**What it does:** Compares results to the goal in the brief, explains what worked and what
didn't with evidence, checks whether the gates and any overrides called it right, and writes
1 to 3 tagged learnings that future briefs pull in automatically. Writes `retro.md`.
**When to use it:** When the campaign's goal date has passed, for an early read on a live
campaign, or every week across all active campaigns.
```text
/campaign-retro 2026-11-month-end-webinar
/campaign-retro week          # all active campaigns, saved to reports/weekly/
```

### Coming soon

| Command | What it will do | When you'll use it |
|---|---|---|
| `/autoplan-campaign <slug>` | Runs the CMO, brand, and ops reviews in order with default answers | When you want a full plan without the back and forth |
| `/brand-system` | Builds or extends `BRAND.md` from your brand assets | Setting up, or after a rebrand |
| `/audit` | Scores how well the assistant knows your team and tools (the Four Cs) and which sprint steps you're using | Monthly, or when results feel off |
| `/guard`, `/freeze <slug>`, `/unfreeze` | Turn on send protection; lock edits to one campaign folder | Around launches, or while fixing one campaign |

### A full run, start to finish

```text
/campaign-office-hours webinar on faster month-end close for VP Finance
/plan-cmo-review 2026-11-month-end-webinar
/plan-brand-review 2026-11-month-end-webinar
/plan-ops-review 2026-11-month-end-webinar
/creative-shotgun 2026-11-month-end-webinar email-1
/copy-review 2026-11-month-end-webinar
/compliance-review 2026-11-month-end-webinar
/campaign-qa 2026-11-month-end-webinar
   ...fix what QA found...
/campaign-qa 2026-11-month-end-webinar recheck
/launch 2026-11-month-end-webinar            # coming soon; send by hand for now
/campaign-retro 2026-11-month-end-webinar    # after the goal date
```

---

## Make it yours

Everything is plain Markdown. You change behavior by editing files, not code.

| You want to... | Edit this |
|---|---|
| Change company, audience, team, channels, or calendar facts | `context/*.md` (or re-run `/onboard-marketing <area>`) |
| Change voice, tone per channel, approved claims, banned phrases, required footer | `BRAND.md` |
| Swap HubSpot, Salesforce, Asana, or Jira for your own tools | `connections.md` (and add notes for the new tool in `references/`) |
| Change campaign or UTM naming rules | `playbooks/naming-conventions.md` (the UTM builder reads it) |
| Change what a "complete" intake means | `playbooks/intake-checklist.md` |
| Change what QA checks and how severe each issue is | `playbooks/qa-checklist.md` |
| Change how the assistant makes decisions (e.g. how cautious to be at launch) | `ETHOS.md` |
| Change the pass score, the questions a role asks, or what it writes | That skill's `.claude/skills/<name>/SKILL.md` |
| Change rules every skill follows | `.claude/skills/_shared/preamble.md` |
| Change standing instructions for the assistant | `CLAUDE.md` and `AGENTS.md` (keep them in sync) |
| Change when routines run | The cron line in each `routines/*.md` file |
| Add a new role or command | Copy a skill folder in `.claude/skills/`, rename it, and edit its `SKILL.md` |

**Two things to keep when you customize:** each skill writes exactly one file, and nothing
goes live without every gate and a typed human confirmation. Most of the safety in this
template comes from those two rules.

Using Codex or another agent instead of Claude Code? `AGENTS.md` and `.agents/skills/` hold
the same instructions and skills.

---

## The campaign folder contract

Every campaign lives in `campaigns/<YYYY-MM-slug>/`. Each skill reads what it needs from that
folder and writes exactly one file back. No skill overwrites another skill's file: to revise
one, re-run the skill that owns it.

| File | Written by | Read by |
|---|---|---|
| `status.md` | every skill (stage, scores, overrides) | every skill |
| `brief.md` | `/campaign-office-hours` | everything after it |
| `plan-cmo.md` | `/plan-cmo-review` | brand, ops, creative |
| `plan-brand.md` | `/plan-brand-review` | ops, creative, `/copy-review` |
| `plan-ops.md` | `/plan-ops-review` | `/campaign-qa`, `/launch` |
| `creative/` | `/creative-shotgun`, you | reviews, QA |
| `review-copy.md` | `/copy-review` | `/campaign-qa`, `/launch` |
| `review-compliance.md` | `/compliance-review` | `/launch` |
| `qa-report.md` | `/campaign-qa` | `/launch` |
| `launch.md` | `/launch` | `/launch-watch`, `/campaign-retro` |
| `watch.md` | `/launch-watch` | `/campaign-retro` |
| `retro.md` | `/campaign-retro` | `/learnings`, future briefs |

## Where things live

| Folder or file | What's in it |
|---|---|
| `BRAND.md` | Voice, tone, approved claims, banned phrases, required elements |
| `context/` | Company, audiences, team and approvers, channels, calendar |
| `connections.md` | Every tool the assistant can reach, and what it's allowed to do there |
| `ETHOS.md` | The seven principles behind every skill |
| `playbooks/` | Naming conventions, intake checklist, QA checklist |
| `campaigns/` | One folder per campaign. `_template/` is the starting point |
| `learnings/learnings.md` | Tagged lessons from retros |
| `decisions/log.md` | Decisions and gate overrides, append-only |
| `transcripts/` | Meeting transcripts and their summaries |
| `reports/` | Daily, weekly, and monthly reports across campaigns |
| `routines/` | Scheduled work and the rules for running unattended |
| `scripts/` | UTM builder, link checker, and `due.mjs`. Node.js 18+, no dependencies |
| `tests/` | One test scenario per skill, using a fictional company |
| `examples/northwind/` | A filled-in example for a fictional company, with one campaign partway through the sprint |

## Default stack

HubSpot (email, landing pages, forms) · Salesforce (CRM) · Asana (tasks) · Jira (web and dev
requests) · Claude in Chrome (browser QA). Swap any of them in `connections.md`.

## Credits

This template stands on two open-source projects. Thank you to both authors.

**[gstack](https://github.com/garrytan/gstack) by Garry Tan** (MIT). The workflow: the
sprint, role-based slash-command skills that hand files to each other, the office-hours
forcing questions, the four scope modes, scored review gates, the QA loop, retros and
learnings, the guardrail hooks, and the builder ethos that `ETHOS.md` rewrites for marketing.
`/campaign-office-hours`, `/plan-cmo-review`, `/plan-brand-review`, `/plan-ops-review`,
`/creative-shotgun`, `/copy-review`, `/campaign-qa`, `/campaign-retro`, and `/learnings` are
adapted from gstack's `/office-hours`, `/plan-ceo-review`, `/plan-design-review`,
`/plan-eng-review`, `/design-shotgun`, `/review`, `/qa`, `/retro`, and `/learn`.
`/compliance-review` borrows its evidence-first findings from `/cso`.

**AIS-OS by Nate Herk** (MIT). The foundation: the Four Cs of an AI operating system
(context, connections, capabilities, cadence), the Three Ms of AI mindset, the onboarding
and audit patterns, and the `CLAUDE.md` / `AGENTS.md` / `context/` layout.
`/onboard-marketing` is adapted from its onboarding pattern. *The Three Ms of AI™ is a
trademark of Nate Herk.*

Both licenses are reproduced in full in [NOTICE.md](NOTICE.md), as they require.
