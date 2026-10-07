---
campaign: YYYY-MM-short-name
stage: brief          # brief | plan | create | review | qa | launch | watch | retro | done
owner: TBD
launch_date: TBD
updated: TBD
scores:               # 0 to 10. Gate passes at 7 or above.
  cmo: null
  ops: null
  brand: null
  copy: null
  compliance: null    # pass / fail
  qa: null            # open blockers count
overrides: []         # - {gate, score, who, why, date}
links:
  asana: TBD
  salesforce_campaign: TBD
  hubspot: TBD
  jira: []
---

# Status: YYYY-MM-short-name

Copy this folder to `campaigns/<YYYY-MM-short-name>/` to start a new campaign, then run
`/campaign-office-hours`. Each skill writes its own file here. See `README.md` for the full
file list.
