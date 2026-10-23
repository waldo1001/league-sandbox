---
topic: engines-floor
status: approved
created: 2026-10-23
spec: docs/specs/3-engines-floor.md
---

## Spec
- Spec file: docs/specs/3-engines-floor.md (status `approved`)
- AC IDs covered by this cycle: AC1, AC2, AC3, AC4

## Task
Raise `engines.node` in `package.json` to `^22.23.4 || ^24.22.1 || >=26.12.1` and pin it with a Jest test.

## Scope boundary
- IN: `engines.node` value in `package.json` (protected path; the spec explicitly requires this edit and approval comes from the approved spec via operator mode); a new Jest test.
- OUT: ci.yml, .nvmrc, engine-strict, anything in `src/`, `package-lock.json`.

## Files to create / touch
- src/__tests__/engines.test.js (new)
- package.json (engines value only)
- docs/specs/3-engines-floor.md (Verification table, status)

## Interface
None. The test requires `semver` (already in the lockfile transitively via Jest) and reads `package.json`.

## Dependencies
`semver` from node_modules (no new package, lockfile unchanged).

## RED test list
- AC1: engines.node equals the exact range string
  - test file: src/__tests__/engines.test.js
  - test name: "AC1: engines.node equals the patched range"
  - seams touched: none (reads package.json)
- AC2: 22.23.4, 24.22.1, 26.12.1 satisfy the range
  - test name: "AC2: patched releases satisfy the range"
- AC3: 20.19.0, 22.23.3, 24.22.0, 26.12.0 do not satisfy it
  - test name: "AC3: vulnerable or unsupported releases are rejected"
- AC4: no new dependency; full suite passes
  - verified by `npm test` and unchanged package-lock.json

## Telemetry
None — this repo has no telemetry stack.

## Open questions / assumptions
- Assumption: transitive `semver` is hoisted at node_modules/semver (it is).

## Risks
- Developers on older Node see an npm EBADENGINE warning (not an error; no engine-strict).

## Blast radius / breakage prediction
- **Rating:** `low-risk`
  - Declarative metadata only; nothing in `src/` changes; npm only warns on mismatch.
- **Who/what could break:** nothing at runtime; CI on `22.x` resolves to a patched release.
- **Detection:** the new engines test fails if the range is altered; npm warns on unsupported Node.

## Out-of-scope follow-ups
- None.
