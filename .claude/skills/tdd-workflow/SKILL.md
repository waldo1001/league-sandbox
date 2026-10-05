---
name: tdd-workflow
description: 'Test-Driven Development workflow for the league-sandbox repo. Enforces the PLAN -> FRAME -> TESTS -> PROVE RED -> SCAFFOLD -> IMPLEMENT -> VERIFY -> SECURITY SCAN -> DOCUMENT cycle. Requires an approved spec (SDD Phase 0 - /spec-authoring) before the PLAN phase. Use when: adding features, fixing bugs, refactoring code, or adding modules under src/. Mandatory before any code change.'
argument-hint: "<spec path, e.g. docs/specs/1-clamp-helper.md>"
---

# /tdd-workflow - league-sandbox TDD enforcer

You are about to make a code change in league-sandbox (a throwaway shakedown repo that copies the conventions of `waldo1001/waldo.BCTelemetryBuddy`). This skill forces you through the TDD cycle defined in [docs/tdd/methodology.md](../../../docs/tdd/methodology.md). **Do not skip phases. Do not merge phases.**

## When to use

- Adding a new module or function under `src/`
- Fixing a bug (reproduce with a regression test first)
- Refactoring existing code
- Any change that touches `src/`

## Before you start - load the rules

Re-read these before you write anything:

1. [docs/tdd/methodology.md](../../../docs/tdd/methodology.md) - the cycle in prose (Phase 0 SPEC + Phases 1-9)
2. [docs/specs/README.md](../../../docs/specs/README.md) - spec template, naming, status lifecycle - plus the approved spec for this work
3. [docs/tdd/testability-patterns.md](../../../docs/tdd/testability-patterns.md) - seams and test conventions
4. [docs/tdd/coverage-policy.md](../../../docs/tdd/coverage-policy.md) - thresholds, exclusions, enforcement
5. [.github/copilot-instructions.md](../../../.github/copilot-instructions.md) - project-wide rules (git, SDD)

If the task is a bug fix or refactor, also read the "Bug fixes and refactors" section at the bottom of [methodology.md](../../../docs/tdd/methodology.md).

---

## HARD GATE - Read this before touching any file

**You may NOT write or edit any source-code file until you have:**

1. Confirmed an **approved spec** exists under [docs/specs/](../../../docs/specs/) for this work (Rule 14), OR embedded a qualifying `## Spec-lite` section in the plan (bugfix/refactor/chore rated `safe`/`low-risk`). **A `draft` spec blocks the plan.**
2. Written a plan file under [docs/plans/](../../../docs/plans/) and posted its path in chat
3. Received explicit user approval ("go", "approved", "proceed", "looks good", "yes")

**Silence is not approval.** If the user has not spoken, you do not have approval. "It's a small change" is not an exception. "I know what to do" is not an exception. "The user asked me to just do it" is not an exception unless they explicitly say "skip the design phase".

The design phase is the cheapest point at which to catch a wrong approach. A 30-second approval gate is cheaper than a wrong implementation.

---

## The cycle - Phase 0 (SPEC) + Phases 1-9 (TDD)

| # | Phase | What it produces | Where it lives |
|---|---|---|---|
| 0 | **SPEC** | Approved spec (or `## Spec-lite` in the plan) | `docs/specs/<issue>-<topic>.md` |
| 1 | **PLAN** | Committed markdown plan file, linked to the spec | `docs/plans/<topic>.md` |
| 2 | **FRAME** | 150-word-max framing of the step | Chat only |
| 3 | **WRITE TESTS** | Failing test(s) in `src/__tests__/` | Test file |
| 4 | **PROVE RED** | `RED confirmed: <failure>` line | Chat + terminal |
| 5 | **SCAFFOLD** | Stubs throwing `not implemented` | Source files |
| 6 | **IMPLEMENT** | Minimal code that turns test green | Source files |
| 7 | **VERIFY PASS** | Full suite + coverage at thresholds | Terminal |
| 8 | **SECURITY SCAN** | `/security-scan` -> PASS | Chat + terminal |
| 9 | **DOCUMENT** | Spec Verification table, plan flipped to done | Docs |

Details for each phase are in [methodology.md](../../../docs/tdd/methodology.md). The rest of this file is **actionable checklists and references** - use it as a working surface, not a replacement for the prose doc.

---

## Phase 0 - SPEC (before any plan)

If no approved spec exists for this work, **stop and run [`/spec-authoring`](../spec-authoring/SKILL.md) first** (it takes the GitHub issue number and produces `docs/specs/<issue>-<topic>.md`). For a qualifying `safe`/`low-risk` bugfix/refactor/chore, embed a `## Spec-lite` section in the plan instead.

## Phase 1 - PLAN (file, then STOP)

Write `docs/plans/<topic>.md` with the frontmatter and sections from [methodology.md Phase 1](../../../docs/tdd/methodology.md). Set the `spec:` frontmatter field and copy the AC IDs from the spec into the RED test list. See [docs/plans/README.md](../../../docs/plans/README.md) for the file-naming convention, status lifecycle, and **required sections** (including `Blast radius / breakage prediction`).

**Blast radius is mandatory.** Every plan must include a rating of `safe` | `low-risk` | `risky` | `breaking`, with justification, who/what could break, and how a regression would be detected. If the rating is `risky` or `breaking`, the plan must also spell out the migration path and version-bump implications *before* asking for approval. Do not post the plan for approval without this section filled in.

**After writing the file, post its path in chat and STOP. Wait for explicit approval.** On approval, flip `status: draft` -> `status: approved`.

## Phase 2 - FRAME (chat, 150 words max)

Post in chat: goal / where-it-stands / why-needed / what-it-contributes. Hard cap 150 words. Not committed.

## Phase 3 - WRITE TESTS

Test file locations:

```
src/__tests__/<module>.test.js
```

Test names read like spec lines and reference the AC ID (for example `AC1: returns min when x is below min`). Seams and conventions are in [testability-patterns.md](../../../docs/tdd/testability-patterns.md).

## Phase 4 - PROVE RED

```bash
npx jest --coverage=false src/__tests__/<file>.test.js
```

Post in chat: `RED confirmed: <failure message>`. If the failure is about plumbing (`Cannot find module`, `is not a function`), go to Phase 5 first.

## Phase 5 - SCAFFOLD

Minimum shape so the test can fail for the *right* reason:

- New files + module exports
- Stub implementations throwing `new Error("not implemented: <name>")`

Go back to Phase 4. You should now see a behavior failure.

## Phase 6 - IMPLEMENT

Minimum code to turn this one test green. Loop back to Phase 3 for the next RED.

## Phase 7 - VERIFY PASS

```bash
npm test                  # full suite
npm run test:coverage     # coverage thresholds
npm run build             # build check
npm run compile           # compile check
node scripts/validate-specs.js
```

Thresholds: see [coverage-policy.md](../../../docs/tdd/coverage-policy.md). If tests fail, fix the implementation, not the tests.

## Phase 8 - SECURITY SCAN

Run the [`/security-scan`](../security-scan/SKILL.md) skill. A finding **blocks** the cycle. Never "note and continue".

## Phase 9 - DOCUMENT

1. Update the spec's Verification table (AC <-> test file + name); when all ACs are verified across the spec's plans, flip the spec `status: approved` -> `status: implemented` (no file move - specs stay in `docs/specs/`).
2. Update `README.md` if user-facing behavior changed. Do not edit any `CHANGELOG.md` or `package.json` - those are protected paths that need a human.
3. Flip plan file `status: approved` -> `status: done` **and** `git mv docs/plans/<topic>.md docs/plans/done/<topic>.md` so only in-flight plans live in the top-level folder. A `done` plan in `docs/plans/` is a bug.

Then: "Changes ready - please review and commit when ready." Never run git commands without explicit request (Rule 11). Note: the `git mv` in step 3 is part of the workflow and does not need separate authorization - it's a rename, not a destructive op.

---

## Source Module Checklist

- [ ] **Phase 0 (SPEC):** Approved spec exists (or `## Spec-lite` embedded in the plan); AC IDs known
- [ ] **Phase 1 (PLAN):** Plan file in `docs/plans/` covering function signatures, files touched, RED test list, blast radius; `spec:` frontmatter set
- [ ] **Phase 3 (TESTS):** One test per AC in `src/__tests__/`, named after the spec line; edge cases (empty, boundary, invalid input)
- [ ] **Phase 4 (PROVE RED):** Run the test file, confirm behavior-level failure
- [ ] **Phase 5 (SCAFFOLD):** Module with exported stubs throwing `not implemented`
- [ ] **Phase 6 (IMPLEMENT):** Minimal implementation
- [ ] **Phase 7 (VERIFY):** All tests green, coverage meets threshold, `npm run build` and `npm run compile` pass, `node scripts/validate-specs.js` passes
- [ ] **Phase 8 (SECURITY):** `/security-scan` passes
- [ ] **Phase 9 (DOCUMENT):** Verification table, spec status, plan flipped to `done` and moved to `docs/plans/done/`

---

## Quick command reference

```bash
# Run one test file
npx jest --coverage=false src/__tests__/<file>.test.js

# Run the whole suite
npm test

# Coverage run
npm run test:coverage

# Build and compile checks
npm run build
npm run compile

# Validate spec files
node scripts/validate-specs.js
```

---

**If at any phase the test is hard to write, the code is wrong - not the test. Stop, fix the seam, continue. Never skip a test "just this once".**
