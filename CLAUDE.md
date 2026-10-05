# CLAUDE.md

**league-sandbox is a throwaway shakedown repo.** It exists so waldo.Jarvis's GitHub League can test its whole build ladder (claim a spec, plan, TDD, CI, review, merge gate) against a real GitHub repo before it ever touches `waldo1001/waldo.BCTelemetryBuddy` (BCTB). It copies BCTB's workflow conventions over a tiny plain-Node + Jest codebase. Nothing here is meant to last, and nothing here is a product.

The single source of truth for project rules is **`.github/copilot-instructions.md`**. Read it first.

---

## HARD RULE FOR CLAUDE CODE — Read before doing anything else

**You may NOT write or edit any source code file until you have:**

1. Confirmed an **approved spec** exists under [docs/specs/](docs/specs/) for this work (Rule 14 — or written a `## Spec-lite` section into the plan for a qualifying `safe`/`low-risk` bugfix/refactor/chore). No plan from a `draft` spec.
2. Written a plan file under [docs/plans/](docs/plans/) following [docs/plans/README.md](docs/plans/README.md)
3. Filled in the **Blast radius / breakage prediction** section of that plan — rating (`safe` | `low-risk` | `risky` | `breaking`), justification, who/what could break, and how a regression would be detected. A plan without this section is not a plan and must not be posted for approval.
4. Posted the plan file path in chat
5. Received **explicit** user approval ("go", "approved", "proceed", "looks good", "yes")

**Silence is not approval.** If the user has not spoken, you do not have approval.

"It's a small change" is not an exception. "I know what to do" is not an exception. "The user asked me to just do it" is not an exception unless they explicitly say "skip the design phase".

The plan phase is the cheapest point at which to catch a wrong approach. A 30-second approval gate is cheaper than a wrong implementation.

## The SDD + TDD cycle

Every code change follows: **SPEC (Phase 0, once per issue) → PLAN → FRAME → TESTS → PROVE RED → SCAFFOLD → IMPLEMENT → VERIFY PASS → SECURITY SCAN → DOCUMENT**.

Full details live in these places:

- [.claude/skills/spec-authoring/SKILL.md](.claude/skills/spec-authoring/SKILL.md) — Phase 0: GitHub issue → approved spec
- [.claude/skills/tdd-workflow/SKILL.md](.claude/skills/tdd-workflow/SKILL.md) — actionable phase index + checklists
- [docs/specs/README.md](docs/specs/README.md) — spec template, naming, status lifecycle
- [docs/plans/README.md](docs/plans/README.md) — plan template, naming, status lifecycle, blast radius
- [docs/tdd/methodology.md](docs/tdd/methodology.md) — the cycle in prose
- [docs/tdd/testability-patterns.md](docs/tdd/testability-patterns.md) — seams and test conventions
- [docs/tdd/coverage-policy.md](docs/tdd/coverage-policy.md) — thresholds and enforcement

Phase 8 (SECURITY SCAN) invokes [.claude/skills/security-scan/SKILL.md](.claude/skills/security-scan/SKILL.md). A finding blocks the cycle.

Specs are keyed by GitHub issue number: `docs/specs/<issue-nr>-<topic>.md`, frontmatter `status: draft | approved | implemented`. Plans are topic-first: `docs/plans/<topic>.md`, `status: draft | approved | done` (done plans move to `docs/plans/done/`). Validate specs with `node scripts/validate-specs.js`.

---

## Quick Reference: Build & Test Commands

```bash
npm ci                              # install (lockfile is committed)
npm test                            # run all tests (Jest)
npm run test:coverage               # tests with coverage report (70% threshold enforced)
npm run build                       # no-op build (plain JS)
npm run compile                     # syntax check of src/
npx jest --coverage=false src/__tests__/<file>.test.js   # one test file
node scripts/validate-specs.js      # validate docs/specs/*.md
node scripts/generate-telemetry-config-ci.js   # stub: writes an ignored file
npm run generate-kb-index           # stub: writes an ignored file
```

## Quick Reference: Architecture

```
src/
  math.js              the whole codebase: small pure helpers
  __tests__/           Jest tests, one file per module
scripts/               validate-specs.js plus two pre-build stubs
docs/specs/            behavior specs (keyed by issue number)
docs/plans/            TDD-cycle plans (topic-first), docs/plans/done/ for finished ones
docs/tdd/              methodology, testability patterns, coverage policy
.claude/skills/        spec-authoring, tdd-workflow, security-scan
```

Stack: Node 22, CommonJS, Jest 29. No transpiler, no telemetry, no packages/ workspace.

## Protected paths

Do not edit `.github/**`, `package.json`, any `CHANGELOG.md`, or `scripts/release*` as part of a TDD cycle. They need a human. The two `scripts/generate-*` stubs are pre-build helpers for the League; leave them alone unless a spec says otherwise.

<!-- waldo.Jarvis operator mode -->
## Operator mode (waldo.Jarvis)

Applies ONLY when the environment variable `JARVIS_OPERATOR=1` is set. Human sessions
ignore this section entirely. Everything else in this repository's rules still applies.

- **Approval happened upstream.** The spec you are given is approved (status
  `approved` or label `spec-approved`). That approval also covers the PLAN phase for a
  plan rated `safe` or `low-risk`: write the plan, set it `approved`, continue. A plan
  rated `risky` or `breaking` stops here: write it and end with `PLAN-WAITING`.
- **Use the repository's two entry points.** To build a spec run `/sdd-build {spec}`; to draft
  a spec from an issue run `/sdd-draft {issue}`. Follow the skill exactly; do not substitute
  your own workflow.
- **The operator holds git.** Commit on your branch as the workflow says; never push,
  never open or merge a PR, never touch the default branch.
- **Ambiguity is an answer, not a guess.** If the spec is unclear, end with
  `NEEDS-ANSWER: <question>`.
- End with the report the operator handed you.

## Taking over from the League

A branch `league/<issue>-<topic>` with an open PR labelled `league-building` is being
built by waldo.Jarvis. To take over: stop the build (HUD, phone, or the Jarvis MCP tool
`stop_league_build`), then `git fetch && git switch league/<issue>-<topic>`. The PR body
section `## League state` tells you the phase, the last test run, what is done and what
is next. Continue as a normal human session; merge when satisfied. The League will not
touch the branch again unless you hand it back.
<!-- /waldo.Jarvis operator mode -->
