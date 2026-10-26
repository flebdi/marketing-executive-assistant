# Example: Northwind Analytics

**Northwind Analytics is a fictional company.** Every person, email address, number, and
quote here is made up, so you can read, copy, and share these files freely.

This folder shows what the template looks like once a team has filled it in. Use it to see
what a good answer looks like before you run `/onboard-marketing` for your own team, or to
compare your files against a filled-in set.

## What's here

The folders mirror the root of the template, so every file sits where it would in a real
setup.

| File | What it shows | Written by |
|---|---|---|
| [BRAND.md](BRAND.md) | Voice traits with "this, not that" examples, tone per channel, one approved claim with its source and expiry, banned phrases, voice samples | `/onboard-marketing` |
| [context/company.md](context/company.md) | Offer, positioning, a competitor, quarterly goals, top marketing pain | `/onboard-marketing` |
| [context/audiences.md](context/audiences.md) | Ideal customer profile and the VP Finance persona | `/onboard-marketing` |
| [context/team.md](context/team.md) | Five people, the approval chain, and SLAs | `/onboard-marketing` |
| [context/channels.md](context/channels.md) | Channel owners, send rules, and compliance by region | `/onboard-marketing` |
| [context/calendar.md](context/calendar.md) | Send rules, blackout dates, and upcoming launches | `/onboard-marketing` |
| [decisions/log.md](decisions/log.md) | One logged decision: start with one email to US prospects only | `/campaign-office-hours` |
| [campaigns/2026-11-year-end-close/](campaigns/2026-11-year-end-close/) | A campaign partway through the sprint (see below) | the sprint skills |

Notice the `TBD (needs: ...)` entries. The skills leave a gap and say who can fill it rather
than inventing an answer.

## The example campaign

`2026-11-year-end-close` offers US VP Finance prospects a year-end close checklist and a
30-minute working session, by email. It's a snapshot in progress, not a finished campaign:

| Stage | File | State |
|---|---|---|
| Brief | `brief.md` | Done. Goal: 12 sales-accepted opportunities by 2026-12-18 |
| Plan | `plan-cmo.md` | Done. Scored 7 (the brief as first written scored 6). Mode: hold, one email to US prospects |
| Plan | `plan-brand.md`, `plan-ops.md` | Not run yet |
| Create | `creative/final/email-1.html` | First draft of email 1 |
| QA | `qa-report.md` | An early baseline run that fails its gate on purpose, to show what a blocker looks like |

Read the files in that order to follow the sprint from idea to QA.

## Try it

To run the skills against Northwind instead of a blank template, copy these files over the
root ones in a scratch copy of the repo (not your real one):

```bash
cp examples/northwind/BRAND.md .
cp examples/northwind/context/*.md context/
cp -r examples/northwind/campaigns/2026-11-year-end-close campaigns/
```

Then pick up where the campaign stopped, for example `/plan-brand-review 2026-11-year-end-close`.
To reset, run `git checkout -- BRAND.md context` and delete the campaign folder.
