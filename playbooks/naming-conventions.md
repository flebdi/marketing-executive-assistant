# Naming conventions

One set of rules for campaign names and UTMs. `scripts/utm-builder.mjs` (Phase 1) and
`/plan-ops-review` enforce these. Inconsistent names split your reporting, so the rules are
strict on purpose.

## General rules

- Lowercase only.
- Hyphens between words. No spaces, underscores, or special characters.
- No dates inside UTM values except `utm_campaign`, which starts with `YYYY-MM`.
- Reuse values from the lists below. Add a new value only by updating this file first.

## Campaign slug

Format: `YYYY-MM-<short-name>`

- Examples: `2026-11-ai-webinar`, `2027-01-q1-product-launch`
- The same slug is used for the campaign folder, `utm_campaign`, the Asana project, and the
  Salesforce campaign name suffix.

## Salesforce campaign name

Format: `<YYYY-MM> | <Type> | <Short name>`

- Example: `2026-11 | Webinar | AI Webinar`
- Types: `Webinar` · `Email` · `Paid Social` · `Paid Search` · `Event` · `Content` · `Nurture`

## UTM parameters

| Parameter | Rule | Allowed values |
|---|---|---|
| `utm_source` | Where the click came from | `hubspot` · `linkedin` · `google` · `meta` · `x` · `youtube` · `partner-<name>` |
| `utm_medium` | Channel type | `email` · `social` · `paid-social` · `cpc` · `display` · `referral` · `event` |
| `utm_campaign` | The campaign slug | `YYYY-MM-<short-name>` |
| `utm_content` | Which link or variant | `<asset>-<placement>`, e.g. `email1-cta-button`, `ad-variant-b` |
| `utm_term` | Paid keyword only | the keyword, hyphenated |

## Rules for links

- Every external link in a campaign asset gets a full UTM set (source, medium, campaign,
  content).
- Never put UTMs on links between pages of your own site. It overwrites the original source.
- Use the same `utm_content` value in the asset and in `plan-ops.md`, so `/campaign-qa` can
  match them.
