# Decisions log

Append-only. Newest at the bottom. Gate overrides go here too.

Format: `## YYYY-MM-DD: <decision>` then **Why**, **Decided by**, and **Alternatives considered**.

---

## 2026-10-07: Build as a lean template, keep gstack as a local reference
- **Decision:** Moved the gstack clone to `_reference/gstack/` (gitignored) and started a fresh repo. Skills are rewritten as plain Markdown, with no Bun or build step.
- **Why:** gstack is mostly engineering tooling. Its skills depend on gstack binaries, and its install path would collide with a real gstack install. Marketers need something they can clone and run.
- **Decided by:** Forkane Lebdi
- **Alternatives considered:** Fork gstack in place.

## 2026-10-07: Private repo for v1
- **Decision:** Keep the repo private until v1 is ready.
- **Decided by:** Forkane Lebdi

## 2026-10-07: Worked-example stack is HubSpot, Salesforce, Asana, Jira
- **Decision:** HubSpot for email, landing pages, and forms. Salesforce as the CRM (campaigns, leads, attribution). Asana for marketing tasks. Jira for web and dev requests.
- **Why:** A common mid-market B2B stack, and close to the Acquia MOps setup.
- **Decided by:** Forkane Lebdi

## 2026-10-07: Claude in Chrome for browser QA
- **Decision:** `/campaign-qa` uses Claude in Chrome. No Bun or gstack `/browse` install required.
- **Why:** Simplest setup for marketing teams. Uses the tester's real logged-in sessions.
- **Decided by:** Forkane Lebdi
- **Alternatives considered:** gstack `/browse`.

## 2026-10-07: This is the Marketing department template (Q4 priority #2)
- **Decision:** This project is the Marketing template for the "3 AI OS department templates by mid-December" priority.
- **Decided by:** Forkane Lebdi
