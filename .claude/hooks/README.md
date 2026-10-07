# Hooks

Guardrails enforced by Claude Code `PreToolUse` hooks. Built in Phase 4.

- `send-guard.mjs`: pauses or blocks any send, publish, schedule, or delete in a live tool.
- `freeze-guard.mjs`: locks edits to one campaign folder while `/freeze` is active.

Registered in `.claude/settings.json`.
