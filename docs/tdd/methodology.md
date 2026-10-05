# SDD + TDD Methodology — league-sandbox

> **Source of truth for rules:** [.github/copilot-instructions.md](../../.github/copilot-instructions.md).
> This file holds the **how** of the cycle. It is a short copy of the parent project's methodology (`waldo1001/waldo.BCTelemetryBuddy`), trimmed to what this repo uses.

Every code change in this repo — new feature, bug fix, refactor — follows the cycle below. The cycle is the default; it is not opt-in.

---

## Phase 0 — SPEC (once per issue, before any cycle)

Before the first plan, an **approved behavior spec** must exist: WHAT is changing and WHY, with acceptance criteria.

- Specs live at `docs/specs/<issue-nr>-<topic>.md`, keyed by GitHub issue. Template, frontmatter and naming: [docs/specs/README.md](../specs/README.md).
- Acceptance criteria are Given/When/Then bullets with stable IDs (`AC1..ACn`). They freeze at approval; plans and tests reference them by ID.
- Lifecycle: `draft -> approved -> implemented`. **Post the spec path in chat and STOP for approval — silence is not approval.** Never write a plan from a `draft` spec.
- **Spec-lite**: a bug fix, refactor, or chore rated `safe`/`low-risk` may embed a `## Spec-lite` section in the plan file instead of a full spec.

Use the [`/spec-authoring`](../../.claude/skills/spec-authoring/SKILL.md) skill to turn an issue into a spec.

---

## The cycle — Phase 0 (SPEC) + Phases 1–9 (TDD)

The skill [.claude/skills/tdd-workflow/SKILL.md](../../.claude/skills/tdd-workflow/SKILL.md) is the actionable index. This doc explains the phases in prose.

0. **SPEC** — approved behavior spec with acceptance criteria; once per issue
1. **PLAN** — write a committed plan file linked to the spec, stop, wait for approval
2. **FRAME** — post a framing of at most 150 words
3. **WRITE TESTS** — write the failing test(s) that encode the requirement
4. **PROVE RED** — run the test, observe the failure, confirm it is about behavior (not plumbing)
5. **SCAFFOLD** — add the minimum module shape so the test fails for the right reason
6. **IMPLEMENT** — smallest code that turns the test green
7. **VERIFY PASS** — full suite + coverage thresholds
8. **SECURITY SCAN** — run the [`/security-scan`](../../.claude/skills/security-scan/SKILL.md) skill; a finding blocks the cycle
9. **DOCUMENT** — spec Verification table, flip spec and plan status

---

## Phase 1 — PLAN (write a file, then STOP)

Write `docs/plans/<topic>.md` (flat, topic-first name). Frontmatter, required sections and the mandatory **Blast radius / breakage prediction** section are defined in [docs/plans/README.md](../plans/README.md). Post the path in chat and wait for explicit approval ("go", "approved", "proceed", "looks good", "yes").

## Phase 2 — FRAME

At most 150 words in chat: goal, where it stands, why it is needed, what it contributes. Not committed.

## Phase 3 — WRITE TESTS

Tests live in `src/__tests__/<module>.test.js`. Test names read like spec lines and carry the AC ID.

## Phase 4 — PROVE RED

Run the test and post `RED confirmed: <failure message>`. The failure must be about behavior. If it is about plumbing (`Cannot find module`, `is not a function`), do Phase 5 first.

## Phase 5 — SCAFFOLD

Exports and stubs that throw `new Error("not implemented: <name>")`. Back to Phase 4 for a behavior-level failure.

## Phase 6 — IMPLEMENT

The smallest change that turns the one failing test green. Loop back to Phase 3 for the next AC.

## Phase 7 — VERIFY PASS

`npm test`, `npm run test:coverage`, `npm run build`, `npm run compile`, `node scripts/validate-specs.js`. Fix the implementation, never the test.

## Phase 8 — SECURITY SCAN

Run `/security-scan`. A finding blocks the cycle.

## Phase 9 — DOCUMENT

Fill the spec's Verification table (AC <-> test file + name); flip the spec to `implemented` when every AC is verified; flip the plan to `done` and `git mv` it to `docs/plans/done/`.

---

## Bug fixes and refactors

- **Bug fix:** write a regression test that reproduces the bug first, prove it RED, then fix. A qualifying `safe`/`low-risk` bug fix may use Spec-lite.
- **Refactor:** existing tests must stay green and unchanged; add characterization tests first if coverage is thin. A qualifying `safe`/`low-risk` refactor may use Spec-lite.
