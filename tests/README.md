# Tests

One scenario file per skill: `tests/<skill-name>.md`.

Each scenario has:

- **Input:** a fictional situation (e.g. a vague brief).
- **Must do:** behaviors that have to happen.
- **Must not do:** behaviors that fail the test.
- **Pass criteria:** what the output file must contain.

Run each scenario in a fresh Claude Code session before marking a phase done. When a test
fails, fix the skill, not the output.
