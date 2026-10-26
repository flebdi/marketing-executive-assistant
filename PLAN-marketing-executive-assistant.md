# Plan: Marketing Executive Assistant (gstack for marketing teams)

**Owner:** Forkane Lebdi

---

## 1. What we're building

A Claude Code template that turns Claude into a **virtual marketing team**. It's built from two parts:

- **Foundation, from Nate Herk's AIS-OS (the Four Cs):** context, connections, capabilities, cadence. The assistant knows the company, the brand and the team, and can reach their tools.
- **Workflow, from Garry Tan's gstack (the sprint):** specialist roles as slash commands. Each one hands a file to the next, with scored review gates and enforced safety rules.

The campaign sprint:

**Brief → Plan → Create → Review → QA → Launch → Retro**

Who it's for:
- In-house marketing and Marketing Ops (MOps) teams of 1 to 15 people.
- Solo marketers and agencies that run campaigns for clients.

What "done" means for v1:
- One person can take a campaign from idea to retro using only slash commands.
- Every step writes a file into the campaign folder.
- Nothing gets sent or published without passing the gates and a confirmation.
- There's a real README and one complete worked example. This is the bar from `context/priorities.md`.

---

## 2. Decision #1: what to do with the gstack clone

The folder currently holds a full clone of `garrytan/gstack`. That includes about 1.3 MB of changelog, a Bun build system, iOS tools, security-runtime CI, and a browser daemon. Most of it is for software engineering, and its `setup` installs globally as `gstack`.

**Recommended: build a lean template, and keep gstack as a reference.**

1. Move the current clone into `_reference/gstack/` and add that path to `.gitignore`.
2. Run `git init` on the folder as a new repo, `marketing-executive-assistant`.
3. Rewrite the skills you need as plain Markdown skills. No Bun, no build step, no template generator.
4. Credit gstack and AIS-OS in `NOTICE.md`. Both are MIT-licensed, which allows this as long as their copyright and license text are included.

**Why not fork gstack as-is:**
- A fork drags in hundreds of engineering-only files and a toolchain marketers can't maintain.
- Its skill preambles call gstack binaries (`gstack-config`, telemetry, update checks). Every adapted skill would break without them.
- Its install path (`~/.claude/skills/gstack`) would collide with a real gstack install.
- Marketing teams need a template a non-developer can clone and run. gstack isn't that.

**What to reuse from gstack:**

| gstack piece | Reuse as |
|---|---|
| Sprint chaining (each skill reads the previous skill's file) | The campaign folder contract (section 4) |
| `/office-hours` six forcing questions | `/campaign-office-hours` (rewritten for marketing) |
| `/plan-ceo-review` four scope modes | `/plan-cmo-review` |
| `/plan-design-review` 0–10 scoring | All `/plan-*` and `*-review` gates |
| `/qa` "reproduce, fix, re-verify" loop | `/campaign-qa` |
| `/retro` + `/learn` | `/campaign-retro` + `/learnings` |
| `/careful` / `/freeze` hook scripts | Send guardrails (section 6) |
| `/autoplan` pipeline | `/autoplan-campaign` |
| Shared preamble idea | `.claude/skills/_shared/preamble.md` |
| ETHOS.md | `ETHOS.md`, rewritten for marketing (section 7) |

**Optional:** install the real gstack globally as well. Its `/browse` gives `/campaign-qa` a real browser. It needs Bun, which works on Windows. v1 doesn't require it. `/campaign-qa` can use Claude in Chrome or headless Chrome instead.

---

## 3. Folder structure

```
marketing-executive-assistant/
├── CLAUDE.md                  # master prompt: who we are, skills, where things live
├── AGENTS.md                  # same content, for Codex and other agents
├── README.md                  # install, quick start, the sprint, the worked example
├── ETHOS.md                   # marketing principles (section 7)
├── NOTICE.md                  # credits: gstack (MIT), AIS-OS (MIT)
├── BRAND.md                   # voice, visual rules, approved claims, banned phrases
├── connections.md             # registry of every tool the assistant can reach
├── context/
│   ├── company.md             # what we sell, positioning, competitors
│   ├── audiences.md           # ICP + personas (title, pains, what gets them promoted)
│   ├── team.md                # roles, owners, approvers, SLAs
│   ├── channels.md            # email, paid, social, web, events: rules per channel
│   └── calendar.md            # send calendar, blackout dates, launch windows
├── playbooks/
│   ├── naming-conventions.md  # campaign names + UTM rules
│   ├── intake-checklist.md    # what a request must include (from the MOps validator)
│   └── qa-checklist.md        # baseline checks every launch must pass
├── campaigns/
│   └── _template/             # copied for each new campaign
├── learnings/
│   └── learnings.md           # what we learned, tagged by channel/audience/tactic
├── decisions/log.md           # append-only decisions + gate overrides
├── routines/                  # scheduled work (weekly retro, launch-watch)
├── references/                # API notes for connected tools
├── scripts/
│   ├── utm-builder.mjs        # builds + validates UTM links against naming rules
│   └── link-check.mjs         # checks every link in an HTML email/page
├── .claude/
│   ├── settings.json          # hooks registration
│   ├── hooks/
│   │   ├── send-guard.mjs     # blocks send/publish/delete without confirmation
│   │   └── freeze-guard.mjs   # locks edits to one campaign folder
│   └── skills/
│       ├── _shared/preamble.md
│       └── <skill-name>/SKILL.md   # one folder per skill (section 5)
├── .agents/skills/            # mirror for Codex
└── _reference/gstack/         # gitignored upstream clone
```

---

## 4. The campaign folder contract

This is the main idea taken from gstack. Every campaign lives in `campaigns/<YYYY-MM-slug>/`. Each skill reads the files it needs from that folder and writes exactly one file back.

| File | Written by | Read by |
|---|---|---|
| `status.md` | every skill (updates stage + scores) | every skill, `/audit` |
| `brief.md` | `/campaign-office-hours` | everything downstream |
| `plan-cmo.md` | `/plan-cmo-review` | brand, ops, create |
| `plan-brand.md` | `/plan-brand-review` | ops, create, `/copy-review` |
| `plan-ops.md` | `/plan-ops-review` | `/campaign-qa`, `/launch` |
| `creative/` | `/creative-shotgun`, you | review, QA |
| `review-copy.md` | `/copy-review` | `/launch` |
| `review-compliance.md` | `/compliance-review` | `/launch` |
| `qa-report.md` | `/campaign-qa` | `/launch` |
| `launch.md` | `/launch` | `/launch-watch`, `/campaign-retro` |
| `watch.md` | `/launch-watch` | `/campaign-retro` |
| `retro.md` | `/campaign-retro` | `/learnings`, future briefs |

`status.md` frontmatter example:

```yaml
campaign: 2026-11-example-webinar
stage: review          # brief | plan | create | review | qa | launch | watch | retro | done
owner: Jane Doe
launch_date: 2026-11-18
scores:
  cmo: 8
  ops: 9
  brand: 7
  copy: null
  compliance: null
  qa: null
overrides: []          # any gate passed below threshold, with who + why
```

**Rules:**
- A skill checks its prerequisites first. Example: `/campaign-qa` warns if `plan-ops.md` is missing, because that file holds the UTM and tracking plan to test against.
- Skills never overwrite another skill's file. To revise, re-run the skill that owns it.

---

## 5. Skills

All skills load `_shared/preamble.md` first. The preamble says:
- Read `BRAND.md`, `context/`, and the campaign `status.md`.
- Follow the voice rules.
- Write output to the campaign folder.
- Update `status.md`.
- Score honestly. Never invent metrics.

### Foundation (Four Cs)

| Skill | Role | What it does |
|---|---|---|
| `/onboard-marketing` | Chief of staff | A 10-question intake: company, offer, ICP, channels, team, approvers, tools, brand voice samples, send calendar, top pain. Fills `context/` and `BRAND.md`. |
| `/brand-system` | Brand lead | Builds or extends `BRAND.md` from existing assets: voice, tone by channel, colors and fonts, approved claims with sources, banned phrases. Adapted from gstack's `/design-consultation`. |
| `/audit` | Ops auditor | Scores the setup on the Four Cs, plus sprint coverage (which stages have working skills, and which campaigns are stuck). Saves a dated report. |
| `/learnings` | Memory | Search, add, prune, and export learnings. Briefs automatically pull the relevant ones. |

### The sprint

| Stage | Skill | Role | Reads → writes | Gate |
|---|---|---|---|---|
| Brief | `/campaign-office-hours` | Marketing partner | context, learnings → `brief.md` | none (it's the start) |
| Plan | `/plan-cmo-review` | CMO | brief → `plan-cmo.md` | score ≥ 7 |
| Plan | `/plan-brand-review` | Brand lead | brief, plan-cmo, BRAND.md → `plan-brand.md` | score ≥ 7 |
| Plan | `/plan-ops-review` | MOps lead | brief, plan-cmo, plan-brand → `plan-ops.md` | score ≥ 7 |
| Plan | `/autoplan-campaign` | Review pipeline | runs CMO → brand → ops in order | surfaces only judgment calls |
| Create | `/creative-shotgun` | Creative director | plan-brand → `creative/variants/` | you pick a winner |
| Review | `/copy-review` | Senior editor | creative, BRAND.md → `review-copy.md` | score ≥ 7, auto-fixes typos |
| Review | `/compliance-review` | Compliance officer | creative, channels → `review-compliance.md` | blocks on any hard fail |
| QA | `/campaign-qa` | QA lead | plan-ops, creative → `qa-report.md` | zero open blockers |
| Launch | `/launch` | Launch manager | all of the above → `launch.md` | all gates pass + human confirm |
| Watch | `/launch-watch` | Campaign analyst | launch → `watch.md` | alerts on anomalies |
| Retro | `/campaign-retro` | Marketing manager | everything → `retro.md` + learnings | none |

### Skill details

**`/campaign-office-hours`.** gstack's six forcing questions, rewritten for marketing:
1. **Demand reality:** what's the strongest evidence this audience cares? Use past results, sales calls, or search data. Not "we think".
2. **Status quo:** what are they doing now instead? What are competitors already saying?
3. **Desperate specificity:** name the exact persona. What's their title? What gets them promoted, and what gets them fired?
4. **Narrowest wedge:** what's the smallest test that would prove this works? One email, one ad set, one week.
5. **Observation:** what did a real customer say or do that surprised you? Use quotes, call notes, or support tickets.
6. **Future-fit:** does this campaign build something that lasts (a list, content, positioning), or is it a one-off?

It pushes back on vague goals ("awareness" means nothing until it has a metric). It ends with a `brief.md` covering: goal + metric, audience, offer, message, channels, the smallest test, budget, timeline, risks, and the learnings that applied.

**`/plan-cmo-review`.** Uses gstack's four scope modes:
- **Expand:** what would the 10x version be?
- **Selective expand:** keep the scope, and offer each add-on with its effort and risk.
- **Hold:** keep the scope and stress-test it.
- **Reduce:** strip it to the minimum that still proves the goal.

It checks that the campaign fits the quarterly priorities, the budget is realistic, and the success metric is measurable.

**`/plan-ops-review`.** The marketing version of gstack's eng review. It covers:
- **Tracking:** UTMs for every link, built with `scripts/utm-builder.mjs` against `naming-conventions.md`.
- **Systems:** CRM campaign setup, list and segment definitions, suppression lists, lead routing, attribution, form and landing-page fields.
- **Scheduling:** Asana or ClickUp tickets, owners, SLAs, and send-calendar conflicts.
- **Intake:** reuses the logic from the `moops-intake-validator` skill.
- **Edge cases:** unsubscribed contacts, duplicates, time zones, mobile rendering, missing personalization fields.

It writes a test plan into `plan-ops.md` that `/campaign-qa` picks up.

**`/plan-brand-review`.** Rates each brand dimension 0–10 (voice, clarity, offer, call to action, visual fit, differentiation), explains what a 10 looks like, then edits the plan to get there. It flags AI-sounding copy: generic hype words, empty superlatives, and filler.

**`/creative-shotgun`.** Generates 4–6 variants: subject lines, ad copy, email bodies, and images (via Higgsfield or Canva when connected). It builds a comparison page, you pick a winner, and it saves the reasoning as taste memory in `learnings/`.

**`/copy-review`.** Catches what gets approved but breaks in market:
- Claims without a source in `BRAND.md`.
- Wrong prices, dates or offer details.
- Broken personalization tokens.
- Inconsistent calls to action.
- Off-brand tone.

It auto-fixes typos and asks before anything else.

**`/compliance-review`.** Checks:
- CAN-SPAM: a physical address and an unsubscribe link.
- GDPR/CASL consent basis.
- Required disclaimers and testimonial or endorsement rules.
- Trademark use.
- Personal data in the creative.

Any hard fail blocks launch.

**`/campaign-qa`.** gstack's QA loop for campaigns. Using a real browser, it:
- Opens every email and landing page.
- Clicks every link and checks that each UTM matches `plan-ops.md`.
- Submits test forms and confirms the record lands in the CRM.
- Checks that the tracking pixel fires.
- Checks mobile width, image alt text and load speed.

Each finding includes the exact steps to reproduce it. It re-checks after fixes.

**`/launch`.** Refuses unless every gate passes or there's a logged override. It shows a final summary (audience size, send time, links, owner) and requires typed confirmation. Then it schedules or publishes, updates the trackers and the CRM campaign status, and writes `launch.md`.

**`/launch-watch`.** For 24–48 hours after launch, it checks bounce rate, spam complaints, deliverability, click-rate anomalies, broken links and form errors. It alerts in Slack or the session.

**`/campaign-retro`.** Compares results to the brief's goal metric. Covers what worked, what didn't and why, and per-owner notes. It writes 1–3 tagged learnings that future briefs pull automatically. A weekly version (`/campaign-retro week`) runs across all active campaigns.

---

## 6. Guardrails (enforced, not advisory)

These are Claude Code `PreToolUse` hooks registered in `.claude/settings.json`, adapted from gstack's `/careful` and `/freeze`. They're written in Node so they run on Windows, Mac and Linux.

**`send-guard.mjs`:**
- Matches any MCP tool or command that sends, publishes, schedules or deletes. Examples: tool names containing `send`, `publish`, `schedule`, `delete`, or ESP/CRM API calls with POST/DELETE to send endpoints.
- Returns `permissionDecision: "ask"` with a plain summary: what, to whom, and how many people.
- Hard-denies sends to a whole list with no segment, deleting CRM records in bulk, and sends when `status.md` shows a failed gate with no override.

**`freeze-guard.mjs`:**
- When `/freeze <campaign>` is active, it blocks edits outside that campaign folder.
- This stops a fix for one campaign from touching another.

**`/guard`:** turns on both guards. Default on for `/launch`.

Overrides are allowed but get logged to `decisions/log.md` and the `overrides` field in `status.md`, with who and why.

---

## 7. ETHOS.md (marketing principles)

gstack's "boil the ocean" works for code because code can be reverted. A send can't be undone. Rewritten principles:

1. **Thorough in planning, careful at launch.** Be complete in briefs, plans and QA, because it's cheap now. Be conservative at send time.
2. **Evidence over opinion.** Every claim and goal ties to data, a source, or a real customer quote.
3. **Smallest test first.** Prove it on a segment before the whole list.
4. **Search before creating.** Check learnings and past campaigns before writing from scratch.
5. **Brand is a gate, not a vibe.** Score it. A 7 is the minimum to ship.
6. **Every campaign teaches the next one.** No retro, no learning, no compounding.

---

## 8. Connections (works with any stack)

The template must work for any team, so tools plug into slots in `connections.md`:

| Tier | What | Examples | v1 default |
|---|---|---|---|
| 0: Files | Paste or drop exports | CSV reports, HTML emails, screenshots | Always works |
| 1: Read | Analytics + reporting | GA4, ESP reports, HubSpot/Salesforce read | Recommended |
| 2: Write (safe) | Tasks + docs | Asana, ClickUp, Google Drive, Slack messages | Optional |
| 3: Send/publish | Guarded actions | ESP send, ad launch, CMS publish | Behind `send-guard` |

Rules:
- Prefer direct APIs with a saved endpoint reference over loading many MCP servers, because they use fewer tokens. This follows Nate's guidance.
- Give the assistant its own service account with the least permissions it needs.
- Keys go in `.env`, never in chat or in committed files.

---

## 9. Build phases

### Phase 0: Repo setup
- [x] Move the gstack clone into `_reference/gstack/`, gitignore it, and `git init`.
- [x] Create the folder skeleton from section 3.
- [x] Write `CLAUDE.md`, `AGENTS.md`, `NOTICE.md`, `ETHOS.md`, `_shared/preamble.md`.
- [x] Write the `BRAND.md` and `context/*.md` templates (blank, with guidance comments).
- [x] Write `playbooks/naming-conventions.md` (campaign + UTM rules) and `campaigns/_template/`.
- [x] Commit: "Scaffold Marketing Executive Assistant".

### Phase 1: MVP, the core loop
- [ ] `/onboard-marketing`
- [ ] `/campaign-office-hours`
- [ ] `/campaign-qa` + `scripts/link-check.mjs` + `scripts/utm-builder.mjs`
- [ ] `/campaign-retro` + `/learnings`
- [ ] Run the fictional worked-example campaign through brief → QA → retro.
- **Exit check:** a stranger could run these 4 commands from the README and get useful files.

### Phase 2: Plan layer
- [ ] `/plan-cmo-review`, `/plan-brand-review`, `/plan-ops-review` (run in that order)
- [ ] `/autoplan-campaign`
- [ ] Scored gates written to `status.md`.

### Phase 3: Create + review
- [ ] `/brand-system`
- [ ] `/creative-shotgun`, with a comparison page for picking variants.
- [ ] `/copy-review`, `/compliance-review`
- [ ] Optional: second-model review (gstack's `/codex` idea) for copy.

### Phase 4: Launch + safety + cadence
- [ ] `send-guard.mjs`, `freeze-guard.mjs`, `/guard`, registered in `settings.json`.
- [ ] `/launch`, `/launch-watch`
- [ ] `/audit` (Four Cs + sprint coverage)
- [ ] Weekly retro routine in `routines/`.

### Phase 5: Publish
- [ ] README: what it is, 2-minute install, the sprint diagram, one command per stage.
- [ ] Complete the worked example folder (every file in section 4 filled in).
- [ ] Mirror skills into `.agents/skills/` and smoke-test in Codex.
- [ ] Push a public GitHub repo.

---

## 10. Testing each skill

For each skill, keep a `tests/<skill>.md` scenario with:
- **Input:** a fictional campaign situation. Example: a vague brief, "we want more awareness for the webinar."
- **Must do:** the behaviors that have to happen. Example: it pushes back on "awareness" and asks for a metric.
- **Must not do:** example, invent metrics, or skip the persona question.
- **Pass criteria:** what the output file has to contain.

Run each scenario in a fresh session before marking a phase done. Fix the skill, not the output. Use the `skill-creator` skill's eval mode once there are more than 5 skills.

---

## 11. Worked example

A **fictional** company with fake data, clearly labelled as fictional so it can be shared publicly:

- **Company:** "Northwind Analytics", a B2B analytics SaaS.
- **Campaign:** a webinar invite series (3 emails + a landing page + LinkedIn ads).
- **Covers:** every stage, including one deliberate QA bug (a broken UTM) that `/campaign-qa` catches, and one gate override that gets logged.
- **Purpose:** the README demo, and a filled-in reference teams can compare their own files against.

---

## 12. Build decisions

Decisions about building the template. They live here, not in `decisions/log.md`, which ships
empty for each team's own marketing decisions.

1. **gstack clone:** moved to `_reference/gstack/` (gitignored) with a fresh repo. Skills are
   plain Markdown, with no Bun or build step. gstack's skills depend on its binaries, and its
   install path would collide with a real gstack install.
2. **Repo visibility:** private until v1 is ready, then public as an open-source template.
3. **Worked-example stack:** HubSpot (email, landing pages, forms), Salesforce (CRM), Asana
   (tasks), Jira (web and dev requests). A common mid-market B2B stack.
4. **Browser for `/campaign-qa`:** Claude in Chrome. No Bun or gstack `/browse` install, and it
   uses the tester's real logged-in sessions.
5. **Plan review order:** CMO, then brand, then ops. Scope decides what ops sets up, and brand
   can change the message and channels ops builds tracking around.

---

## Credits

- **gstack** by Garry Tan (MIT), https://github.com/garrytan/gstack. Sprint structure, role-based skills, forcing questions, scope modes, gates, guardrail hooks.
- **AIS-OS** by Nate Herk (MIT). The Four Cs and Three Ms frameworks. *The Three Ms of AI™ is a trademark of Nate Herk.*
