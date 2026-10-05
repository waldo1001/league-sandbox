# Testability patterns — league-sandbox

Short copy of the parent project's catalog, trimmed to a plain Node + Jest codebase.

- **Pure functions first.** Keep logic in small exported functions with no I/O (see `src/math.js`).
- **Seams for the outside world.** Anything touching the clock, filesystem or network is passed in as a parameter (or wrapped in a tiny module that tests can `jest.mock`). Never reach for a global inside business logic.
- **One test per AC.** Test names read like spec lines and start with the AC ID: `AC1: returns min when x is below min`.
- **Edge cases:** empty input, boundaries, invalid arguments (throw a `RangeError` or `TypeError` with a clear message).
- **Location:** `src/__tests__/<module>.test.js`, CommonJS (`require`), no transpiler.
- **No real secrets or customer names in fixtures.** Use obviously fake values (see `.claude/skills/security-scan/SKILL.md`).
