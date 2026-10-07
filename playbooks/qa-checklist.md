# QA checklist

The baseline every launch must pass. `/campaign-qa` (Phase 1) runs these in a real browser
with Claude in Chrome, plus anything extra listed in the campaign's `plan-ops.md`.

Severity: **Blocker** (can't launch) · **Major** (fix before launch unless overridden) ·
**Minor** (fix if time allows).

## Links and tracking

| Check | Severity |
|---|---|
| Every link opens (no 404, no redirect loop) | Blocker |
| Every external link has a full UTM set that matches `plan-ops.md` | Blocker |
| UTM values follow `naming-conventions.md` | Major |
| No UTMs on internal links | Major |
| Tracking code fires on the landing page (GA4, HubSpot) | Major |

## Forms

| Check | Severity |
|---|---|
| Test submission succeeds and shows the thank-you page | Blocker |
| Test record lands in HubSpot with the right list membership | Blocker |
| Test record syncs to Salesforce with the right campaign member status | Major |
| Required fields and error messages work | Major |

## Email

| Check | Severity |
|---|---|
| Unsubscribe link works | Blocker |
| Physical address in footer | Blocker |
| Personalization tokens render (no raw `{{first_name}}`) and have fallbacks | Blocker |
| Subject line and preview text match the approved version | Major |
| Renders at mobile width (375px) | Major |
| Images have alt text | Minor |

## Landing page

| Check | Severity |
|---|---|
| Offer, date, time, and time zone match the brief | Blocker |
| Readable at mobile width, call-to-action visible without scrolling far | Major |
| Page title and meta description set | Minor |
| Loads in under 3 seconds | Minor |
