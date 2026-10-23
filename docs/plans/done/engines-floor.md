---
topic: engines-floor
status: done
created: 2026-10-23
spec: docs/specs/3-engines-floor.md
---

## Spec
- Spec file: docs/specs/3-engines-floor.md (status `approved`)
- AC IDs covered by this cycle: AC1, AC2, AC3, AC4

## Task
Set `engines.node` in `package.json` to `^22.23.4 || ^24.22.1 || >=26.12.1`, pinned by a Jest test.

## Scope boundary
- IN: the `engines.node` value; a test that reads `package.json` and checks the range
- OUT: `ci.yml`, `.nvmrc`, `engine-strict`, `src/`, any dependency change

## Files to create / touch
- `src/__tests__/engines.test.js` (new)
- `package.json` line 20: `"node": ">=20.0.0"` -> `"node": "^22.23.4 || ^24.22.1 || >=26.12.1"` (**protected path** - edit needs your approval of this plan; it is the one deliberate exception)

## Interface
None exported. The test file holds a small local helper `satisfies(version, range)` that supports exactly the three clause shapes used (`^X.Y.Z`, `>=X.Y.Z`, joined by `||`), so no new dependency is needed. `semver` is only present transitively via Jest (6.3.1) and is not a declared dependency, so the test does not rely on it.

## Dependencies
Node `fs`/`path` and Jest only.

## RED test list
- AC1: `package.json` `engines.node` equals the exact string
  - test file: src/__tests__/engines.test.js
  - test name: "declares engines.node as the patched-release range"
  - seams touched: fs
  - edge cases: none
- AC2: patched versions satisfy the range
  - test name: "accepts 22.23.4, 24.22.1 and 26.12.1"
  - seams touched: none
  - edge cases: exact floor of each clause
- AC3: unpatched versions do not
  - test name: "rejects 20.19.0, 22.23.3, 24.22.0 and 26.12.0"
  - seams touched: none
  - edge cases: one below each floor, plus EOL 20.x
- AC4: no new dependency
  - test name: "adds no dependency beyond jest"
  - seams touched: fs
  - edge cases: `dependencies` absent, `devDependencies` keys are exactly `["jest"]`; verified additionally by `npm ci && npm test` and an unchanged `package-lock.json`

AC1 and AC3 fail against the current `>=20.0.0` (RED); AC2 and AC4 pass trivially for the helper and will be sanity-checked with a deliberately wrong range during PROVE RED.

## Telemetry
None - this repo has no telemetry stack.

## Open questions / assumptions
- Assumption: `^22.23.4 || ^24.22.1 || >=26.12.1` is taken verbatim from the investigation of the 21 Oct 2026 releases; odd 25.x is intentionally excluded.
- Assumption: local Node (v26.12.1) and CI (22.x -> >=22.23.4) satisfy the new range, so `npm ci` shows no engines warning.

## Risks
- npm prints `EBADENGINE` warnings (not errors, no `engine-strict`) on unpatched Node; CI on `22.x` resolves to a patched release, so no warning expected.

## Blast radius / breakage prediction
- **Rating:** `low-risk`
  - Config-only; no runtime code or dependency changes; rollback = revert one commit.
  - Observable only as an npm warning on unsupported Node versions (Node 20 users lose "supported" status).
- **Who/what could break:** developers on Node 20 or unpatched 22/24 see an `EBADENGINE` warning; nothing fails because `engine-strict` is off.
- **Detection:** the new test; CI install log would show `EBADENGINE` if `22.x` ever resolved below 22.23.4.

## Out-of-scope follow-ups
- Pinning CI `node-version` to `^22.23.4` explicitly (`.github/**` is protected; `22.x` already resolves to a patched release).
