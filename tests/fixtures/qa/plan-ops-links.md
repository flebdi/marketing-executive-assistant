# Planned links (FICTIONAL test fixture)

The tracked-links table `/plan-ops-review` puts in `plan-ops.md`. `scripts/link-check.mjs --expect`
reads every full URL in a file like this and matches links by `utm_content`.

Campaign: `2026-11-month-end-webinar` · Site: `northwind.example`

| Asset | Placement | URL |
|---|---|---|
| Email 1 | Header logo | https://northwind.example/webinars/month-end-close?utm_source=hubspot&utm_medium=email&utm_campaign=2026-11-month-end-webinar&utm_content=email1-header-logo |
| Email 1 | CTA button | https://northwind.example/webinars/month-end-close?utm_source=hubspot&utm_medium=email&utm_campaign=2026-11-month-end-webinar&utm_content=email1-cta-button |
| Email 1 | Speaker link | https://northwind.example/team/priya-shah?utm_source=hubspot&utm_medium=email&utm_campaign=2026-11-month-end-webinar&utm_content=email1-speaker-link |
| Email 1 | Footer agenda | https://northwind.example/webinars/month-end-close/agenda?utm_source=hubspot&utm_medium=email&utm_campaign=2026-11-month-end-webinar&utm_content=email1-footer-agenda |
| LinkedIn ad A | Destination | https://northwind.example/webinars/month-end-close?utm_source=linkedin&utm_medium=paid-social&utm_campaign=2026-11-month-end-webinar&utm_content=ad-variant-a |
