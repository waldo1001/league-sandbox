---
spec: 3-engines-floor
issue: 3
status: draft
created: 2026-10-23
approved:
plans: []
---

# Spec: Raise `engines.node` to the patched Node.js releases

## Intent
The Node.js security releases of 21 Oct 2026 fix CVE-2026-111497 (Brotli decoder out-of-bounds write), CVE-2026-105482 (`dns.resolve` truncating hostnames at NUL) and CVE-2026-105483 / CVE-2026-106069 (TLS hostname verification bypass) in 22.23.4, 24.22.1 and 26.12.1. Node 20 is EOL and unfixed. league-sandbox is not exposed (no network, zlib, dns or TLS code, no runtime dependencies; Node runs only in CI and locally), so this is declarative hardening: the declared `engines.node` range must stop admitting vulnerable or unsupported Node versions.

## Actors & scope
Anyone running `npm ci` / `npm test` on a machine (developers, the League, CI). npm reads `engines` and warns on a mismatch.
- IN: the `engines.node` value in `package.json`; a Jest test that pins it
- OUT: see Non-goals

## Behavior
`package.json` declares:

```json
"engines": { "node": "^22.23.4 || ^24.22.1 || >=26.12.1" }
```

Resulting satisfaction (semver):

- `22.23.4`, `22.99.0`, `24.22.1`, `26.12.1`, `27.0.0` satisfy the range
- `20.19.0`, `22.23.3`, `24.22.0`, `26.12.0`, `25.0.0` do not (25.x is an odd, non-LTS line with no fixed release listed)

`package.json` is a protected path: the change itself is made by a human or with explicit approval in the plan, not silently by the cycle.

## Acceptance criteria
- **AC1:** Given `package.json`, When `engines.node` is read, Then it equals exactly `^22.23.4 || ^24.22.1 || >=26.12.1`.
- **AC2:** Given the range from AC1, When tested against `22.23.4`, `24.22.1` and `26.12.1`, Then each satisfies it.
- **AC3:** Given the range from AC1, When tested against `20.19.0`, `22.23.3`, `24.22.0` and `26.12.0`, Then none satisfies it.
- **AC4:** Given the change, When `npm ci && npm test` runs on Node 22.x (CI), Then it passes with no new dependency added (the range check uses the `semver` copy already in the lockfile via Jest, or a hand-rolled comparison; `package-lock.json` gains no new top-level package).

## Non-goals
- Changing the `setup-node` version in `.github/workflows/ci.yml` (`22.x` already resolves to a patched release)
- Adding `.nvmrc`, Dockerfile or any runtime pin
- Adding `engine-strict` to `.npmrc`
- Any change to `src/`

## Telemetry
None — configuration-only change, no user-observable runtime surface.

## Verification
| AC | Test | Status |
|---|---|---|
| AC1 | planned | planned |
| AC2 | planned | planned |
| AC3 | planned | planned |
| AC4 | planned | planned |

## Links
- Issue: #3
- Plan(s): docs/plans/engines-floor.md
- PR(s): —
