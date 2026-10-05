# GitHub Copilot Instructions for this Repository

## Purpose
league-sandbox is a throwaway shakedown repo for waldo.Jarvis's GitHub League. It copies the working conventions of `waldo1001/waldo.BCTelemetryBuddy` over a tiny plain-Node + Jest codebase. This file is a short copy of that project's instructions; it is the single source of truth for rules here, and `CLAUDE.md` points at it.

## Rules (you must follow these)

### 0. Do not ask for confirmation on routine actions
When the user asks for something, do it. The only exceptions are Rule 1, the approval gates in Rule 14, and Rule 11.

### 1. Ask "why" if context is missing
If a change is requested with no stated purpose, ask: "What's the purpose of this change?" and wait for the answer.

### 8. Always create tests
- New behavior gets tests first (Jest, `src/__tests__/<module>.test.js`).
- Bug fixes start with a regression test that fails.
- Run the tests in a terminal and show the output; never assume they pass.

### 9. Keep documentation current
Update `README.md` and the spec's Verification table when behavior changes. Do not edit any `CHANGELOG.md` (protected path).

### 10. Code quality
Keep functions small and pure; pass I/O in as parameters; fail with `TypeError` / `RangeError` and a clear message on invalid input.

### 11. Never execute git commands without an explicit request
Do not run `git add`, `commit`, `push`, `pull`, `merge`, `rebase`, `checkout`, `reset` or similar unless the user asks. Exceptions: read-only commands (`git status`, `git log`, `git diff`), the `git mv` of a finished plan into `docs/plans/done/`, and spec-only commits that touch nothing outside `docs/specs/`.

### 14. Spec-driven development (SDD) — every change starts from an approved spec
Every code change is driven by a spec: WHAT/WHY plus acceptance criteria, approved before any plan or code exists.

- **Full spec:** `docs/specs/<issue-nr>-<topic>.md`, status `draft -> approved -> implemented`. One spec per GitHub issue. Template and lifecycle: [docs/specs/README.md](../docs/specs/README.md).
- **Acceptance criteria** are Given/When/Then bullets with stable IDs (`AC1..ACn`). Plans reference the spec via frontmatter (`spec:`) and reuse its AC IDs in the RED test list.
- **Spec-lite:** a bug fix, refactor or chore rated `safe` or `low-risk` may embed a `## Spec-lite` section in the plan instead. New features and anything `risky`/`breaking` always need a full spec.
- **Never write a plan from a `draft` spec.** AC IDs freeze at approval; changing behavior means amending and re-approving the spec.
- Validate specs with `node scripts/validate-specs.js`.

## Mandatory skills

Before any code change, load and follow:

```
.claude/skills/spec-authoring/SKILL.md ← picking up an issue (SDD Phase 0)
.claude/skills/tdd-workflow/SKILL.md   ← all code changes
.claude/skills/security-scan/SKILL.md  ← Phase 8 of tdd-workflow
```

In Claude Code these are slash commands: `/spec-authoring`, `/tdd-workflow`, `/security-scan`. Reference docs: [docs/tdd/](../docs/tdd/), [docs/specs/](../docs/specs/README.md), [docs/plans/](../docs/plans/README.md).

## Default SDD + TDD workflow

```
SPEC → PLAN → FRAME → WRITE TESTS → PROVE RED → SCAFFOLD → IMPLEMENT → VERIFY PASS → SECURITY SCAN → DOCUMENT
```

### Hard gate (Claude Code and all AI agents)

You may not write or edit source code until: (1) an approved spec exists (or a qualifying Spec-lite is in the plan), (2) a plan file exists under `docs/plans/`, (3) the plan's **Blast radius / breakage prediction** section is filled in (rating `safe` | `low-risk` | `risky` | `breaking`, who/what could break, how a regression is detected), (4) the plan path is posted in chat, and (5) the user has explicitly approved ("go", "approved", "proceed", "looks good", "yes"). Silence is not approval.

### Behavioral rules

1. Never write implementation code first; tests first.
2. Never skip Phase 0 or Phase 1; each needs explicit approval.
3. Never skip Phase 4; PROVE RED with a real behavior-level failure message.
4. Never skip Phase 8; a security-scan finding blocks the cycle.
5. Never mark anything done without running the tests.
6. If a test reveals a bug in existing code, fix the bug, not the test.
7. Keep functions small.
8. RED test AC IDs must be the spec's AC IDs.

## Project architecture reference

```
src/                plain CommonJS modules (src/math.js)
src/__tests__/      Jest tests
scripts/            validate-specs.js and two pre-build stubs
docs/specs/         specs, docs/plans/ plans, docs/tdd/ methodology
.github/workflows/  ci.yml (workflow name: CI)
```

Commands: `npm ci`, `npm test`, `npm run test:coverage`, `npm run build`, `npm run compile`, `node scripts/validate-specs.js`.

## Notes for maintainers

This repo is disposable. Protected paths (`.github/**`, `package.json`, `**/CHANGELOG.md`, `scripts/release*`) are never edited by an automated TDD run.
