---
name: creative-shotgun
description: Creative director who explores 4 to 6 genuinely different directions per asset (email, landing page hero, ad), each built from the brand message plan, checked against BRAND.md before you see it, and laid out side by side on a comparison page. You pick a winner (or a mix, or an A/B pair), and the pick is saved as the final draft with the reason. Writes campaigns/<slug>/creative/variants/ and creative/final/. Use after /plan-ops-review, when copy is needed for a campaign asset, or for another round on one asset (e.g. "/creative-shotgun 2026-11-ai-webinar email-2").
argument-hint: "[campaign slug] [asset, e.g. email-1 | lp-hero | ad-a]"
---

# /creative-shotgun

*Adapted from `/design-shotgun` in Garry Tan's gstack (MIT). See `NOTICE.md`.*

**Role:** The creative director. You don't write one draft and polish it. You explore
genuinely different directions, show them side by side, and let the team pick with their eyes
open. Then you get out of the way.

**Stage:** Create. **Gate:** none. A person picks the winner for each asset.

## 0. Preamble, with one exception

Read `.claude/skills/_shared/preamble.md` (Codex: `.agents/skills/_shared/preamble.md`) and
follow it. Read `_shared/live-data.md` too, for the `/creative-shotgun` data needs.

The exception is preamble section 5 (one output file). Creative is a folder:

- **It owns:** `campaigns/<slug>/creative/variants/` (one `<asset>.md` per asset, plus
  `compare.html`) and the first version of each `creative/final/<asset>.md`.
- **After a pick,** `creative/final/` belongs to the team. `/copy-review` may edit it with
  approval. Re-running this skill on an asset that already has a final draft asks before
  replacing it.
- **It reads:** `brief.md` (required), `plan-cmo.md` (which assets are in scope),
  `plan-brand.md` (the message plan), `plan-ops.md` (tracked URLs, token fallbacks, sender),
  `status.md`, all of `BRAND.md`, `context/audiences.md`, `context/channels.md`,
  `learnings/learnings.md`, and past campaigns' `creative/final/` and `retro.md`.
- **It updates** `status.md` (stage).
- **It never edits** the brief, plan files, `BRAND.md`, or `learnings/` directly. Taste notes
  go to `/learnings add`, with approval (section 8).

## 1. Check prerequisites

- **No `brief.md`:** stop. Point to `/campaign-office-hours`.
- **No `plan-brand.md`:** warn that without an agreed message plan the variants are guesses,
  and copy review will likely send them back. Ask whether to continue from the brief's message.
- **No `plan-ops.md`:** warn that links can't be final. Use placeholders named by placement,
  `[LINK: email1-cta-button]`, list every one in Open items, and say QA will fail until they're
  replaced with the planned URLs.
- **Brand or ops gate failed** with no override: warn and ask whether to continue.

## 2. Pick the assets

List the assets in scope from `plan-cmo.md` (after cuts) and `plan-ops.md` launch settings,
with what each needs:

| Asset | Parts |
|---|---|
| Email | Subject line, preview text, body, call to action |
| Landing page hero | Headline, subhead, call to action, image |
| Paid social ad | Intro text, headline, image, call to action |
| Organic post | Post text, image |

Ask which asset to start with, or all of them in order. Default 4 variants per asset; the user
can ask for up to 6.

## 3. Search before writing

Show, one line each:

- **Evidence:** learnings that match the channel, persona, or tactic (e.g. `tactic:subject-line`).
- **Taste:** past picks and their reasons (`tactic:taste` learnings, past `creative/variants/`
  Pick sections).
- **What won before:** past finals to this persona, with their retro results if cited.
- **Recent performance:** subject lines and rates of recent emails to this audience, if HubSpot
  is reachable.

"Nothing yet for this audience" is a valid answer. Evidence outranks taste: if a past pick
lost in its retro, say so.

## 4. Concepts first

Before writing any copy, propose one concept per variant: a name and a one-line angle. Each
must use a different angle, for example:

- **Pain:** the persona's moment of frustration, in their words.
- **Proof:** an approved claim, front and center.
- **Peer voice:** a customer's words (only with permission, see section 5).
- **Utility:** the thing they get, described plainly.
- **Contrarian:** what the category gets wrong.
- **Timely:** a real date or deadline from the brief. Never invented urgency or scarcity.

**Swap test:** if two concepts' subject lines or headlines could be swapped without anyone
noticing, they're too similar. Replace the weaker one.

Show the concepts and ask: "Write these, or change any?" One round of changes, then write.

## 5. Write the variants

For each variant, write the complete asset, not a fragment:

- Every part the asset needs (section 2), within the lengths in `BRAND.md` Tone by channel.
- The call to action from the message plan, worded exactly or flagged where it differs.
- Links from the `plan-ops.md` tracking plan, matched by placement. Never build or edit a UTM
  link here.
- Tokens with the fallbacks from `plan-ops.md`.
- Required elements from `BRAND.md` (e.g. email footer). If one is still `TBD`, write a visible
  marker such as `[REQUIRED: physical address, TBD in BRAND.md]`, never a made-up value.

**Self-check every variant before showing it.** Record the result under the variant:

- **Claims:** each claim is in `BRAND.md` Approved claims, in scope, in the wording
  `plan-brand.md` agreed. Rewrite a variant that fails; don't show it with a bad claim.
- **Banned phrases:** none. Rewrite if any.
- **Length:** subject and body against Tone by channel.
- **Risks:** anything the reviews must look at, e.g. "quotes a prospect: needs permission",
  "names a competitor".

**Images.** If the asset needs one and an image tool (Canva, Higgsfield) is connected, offer to
generate. Generation can cost credits, so ask first. Otherwise write an image brief per variant:
subject, composition, text overlay, alt text. Follow `BRAND.md` imagery style. No real people's
likeness or customer logos unless the team says it has permission.

## 6. Comparison page

Write `creative/variants/compare.html`: one self-contained static page, no external scripts or
fonts, readable on a phone. One section per asset, with the variants side by side as cards.
Each card shows the angle, the subject line and preview text as an inbox row (for email), the
body, the call to action, and the self-check results. Tell the user the path to open it in a
browser.

## 7. Pick

For each asset, ask:

> Which one? A winner, a mix (e.g. "A's subject line with C's body"), an A/B pair to test, or
> another round with feedback?

- **Another round:** take the feedback and write new variants. At most two more rounds; after
  that, ask the user to pick from what exists or write their own.
- **A/B pair:** only if the brief or `plan-ops.md` plans a test. Record which one is control.
- Ask for the reason in one line: "Why this one?" It's how the team's taste gets written down.

## 8. Write

**`creative/variants/<asset>.md`:**

```markdown
# Variants: <asset>

- **Skill:** /creative-shotgun
- **Date:** <today, YYYY-MM-DD>
- **Campaign:** <slug>
- **Inputs read:** <files actually read>
- **Round:** <1 | 2 | 3>

## Concepts

| Variant | Angle | Support point (plan-brand.md) | Why it might work |
|---|---|---|---|

## Variant A: <angle>

- **Subject:** · **Preview:**
- **Body:**
- **Call to action:** "<words>" → <URL from plan-ops.md or [LINK: placement]>
- **Image brief:** <or "none">
- **Self-check:** claims <list, all approved> · banned phrases: none · length <n> words · risks: <list or none>

## Pick

- **Picked:** <variant, mix, or A/B pair> by <name>, <YYYY-MM-DD>
- **Why:** <their reason>
- **Not picked:** <variant: one-line reason>
```

**`creative/final/<asset>.md`:** the picked version, ready to build.

```markdown
# Final draft: <asset>

- **Skill:** /creative-shotgun
- **Date:** <today> · **Campaign:** <slug>
- **Picked:** <variant> by <name> · **Status:** draft, awaiting /copy-review

- **Subject:** · **Preview:**
- **Body:**
- **Call to action:** "<words>" → <URL>
- **Tokens and fallbacks:** <token: fallback>
- **Required elements:** <footer, disclaimers, or markers for TBD ones>
- **Image:** <file or link, or the image brief>

## Open items

- <placeholders, permissions, TBD required elements>
```

The team builds the asset in its tool from this file. For QA, export a test send or the page
HTML to `creative/final/<asset>.html`.

**Taste.** If the reason for a pick says something reusable ("we prefer the persona's words to
our numbers in subject lines"), offer to save it with `/learnings add`: tag `tactic:taste`,
confidence low, and label it a preference, not a result. Only the retro can show it worked.
Save it only if the user agrees.

## 9. Update status

In `campaigns/<slug>/status.md`, set `stage: create` (only if the current stage is earlier) and
`updated`.

## 10. Close

End with:

1. **Written:** each `creative/variants/<asset>.md`, `compare.html`, and each
   `creative/final/<asset>.md`, as clickable paths.
2. **Picks:** one line per asset, with who picked.
3. **Open items:** placeholders, permissions, and TBD required elements, by owner.
4. **Next:** `/copy-review`, then `/compliance-review`.
