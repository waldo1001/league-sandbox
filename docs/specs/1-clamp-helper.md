---
spec: 1-clamp-helper
issue: 1
status: approved
created: 2026-10-05
approved: 2026-10-05
plans: []
---

# Spec: Add a `clamp(x, min, max)` helper to `src/math.js`

## Intent
`src/math.js` only has `add`. Callers need a way to limit a number to a closed range without hand-writing `Math.min(Math.max(...))` each time. This is the smallest realistic feature for the League's shakedown: one function, a handful of tests, no dependencies.

## Actors & scope
Any caller of `src/math.js`; the League's TDD run. Files affected: `src/math.js`, `src/__tests__/math.test.js`.
- IN: a new exported `clamp(x, min, max)` function and its tests
- OUT: see Non-goals

## Behavior
`clamp(x, min, max)` returns `x` limited to the closed range `[min, max]`:

- `clamp(5, 0, 10)` returns `5`
- `clamp(-3, 0, 10)` returns `0`
- `clamp(42, 0, 10)` returns `10`
- `clamp(0, 0, 10)` and `clamp(10, 0, 10)` return the boundary value
- `clamp(1, 5, 5)` returns `5` (a degenerate range is allowed)

If `min > max` the function throws a `RangeError` with the message `min must be <= max`. If any argument is not a finite number it throws a `TypeError` with the message `x, min and max must be finite numbers`.

## Acceptance criteria
- **AC1:** Given `min <= max`, When `x` is inside `[min, max]`, Then `clamp` returns `x` unchanged.
- **AC2:** Given `min <= max`, When `x` is below `min` or above `max`, Then `clamp` returns `min` or `max` respectively.
- **AC3:** Given `min > max`, When `clamp` is called, Then it throws a `RangeError` with the message `min must be <= max`.
- **AC4:** Given any argument that is not a finite number (for example `NaN`, `Infinity` or a string), When `clamp` is called, Then it throws a `TypeError` with the message `x, min and max must be finite numbers`.

## Non-goals
- Clamping arrays, dates or strings.
- Exposing `clamp` from any new entry point; it is only exported from `src/math.js`.
- Changing `add`.

## Telemetry
None — pure helper, no user-observable surface and this repo has no telemetry stack.

## Verification
| AC | Test | Status |
|---|---|---|
| AC1 | planned | planned |
| AC2 | planned | planned |
| AC3 | planned | planned |
| AC4 | planned | planned |

## Links
- Issue: #1
- Plan(s): docs/plans/clamp-helper.md
- PR(s): none yet
