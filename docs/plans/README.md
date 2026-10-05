# Plans — league-sandbox

This folder holds the committed output of **Phase 1 (PLAN)** of the [TDD cycle](../tdd/methodology.md). Every non-trivial code change in this repo starts with a plan file here, approved by the user, before any test or implementation is written.

Plans survive the chat session they were written in. They double as a decision log: when a bug surfaces weeks later in a feature, the plan file is where you go to find *why* the feature was built the way it was.

---

## Filename convention

Flat, kebab-case, short topic:

```
docs/plans/<topic>.md
```

Examples:

- `docs/plans/clamp-helper.md`
- `docs/plans/math-rounding-fix.md`

**Do not** prefix with dates, sprint numbers, or issue IDs. Topic-first naming makes the folder scannable — you can find a plan six months later by guessing the topic.

> Specs under [docs/specs/](../specs/README.md) are deliberately the opposite — keyed by issue number, because the GitHub issue is their intake record. The plan links to its spec via frontmatter; the plan filename stays topic-first.

One plan file per TDD cycle. If a change needs two cycles, write two plan files (they can share one spec).

---

## Frontmatter

Every plan file starts with YAML frontmatter:

```markdown
---
topic: <short kebab-case topic, same as filename>
status: draft
created: YYYY-MM-DD
spec: docs/specs/<issue-nr>-<topic>.md   # or "spec-lite" if embedded in this plan
---
```

The `spec:` field is required (Rule 14): either the path to an **approved** spec file, or the literal `spec-lite` when a qualifying `## Spec-lite` section is embedded below. Never write a plan from a `draft` spec.

### Status lifecycle

```
draft  →  approved  →  done (and moved to done/)
```

- **draft** — just written. The user has not approved it yet. **No code may be written from a draft.** Lives in `docs/plans/`.
- **approved** — the user has explicitly said "go", "approved", "proceed", "looks good", or "yes". The TDD cycle can start. Flip this manually after approval; silence is not approval. Stays in `docs/plans/`.
- **done** — the cycle is complete, tests are green, docs are updated. In Phase 9 (DOCUMENT), flip the frontmatter to `status: done` **and** `git mv docs/plans/<topic>.md docs/plans/done/<topic>.md` so only in-flight work shows in the top-level folder.

Never skip `approved`. Never flip `draft` straight to `done`. Always do the file move when flipping to `done` — a `done` plan in the top-level folder is a bug.

If a plan is abandoned, delete the file rather than leaving it as `draft` forever — `git log` preserves it if someone needs to recover it later.

---

## Required sections

Copy the sections below into every plan. See [docs/tdd/methodology.md §Phase 1](../tdd/methodology.md) for the full prose version.

```markdown
## Spec
- Spec file: docs/specs/<issue-nr>-<topic>.md (status must be `approved`)
- AC IDs covered by this cycle: AC1, AC3

— OR, for a qualifying safe/low-risk bugfix/refactor/chore —

## Spec-lite
- Intent: <1–2 lines>
- **AC1:** Given <precondition>, When <action>, Then <observable outcome>
- Eligibility: <bugfix|refactor|chore>, blast radius <safe|low-risk>

## Task
One sentence. If you can't state it in one sentence, split it.

## Scope boundary
- IN: ...
- OUT: ...

## Files to create / touch
- src/<file>.js
- ...

## Interface
Function signatures and exported names.

## Dependencies
Existing modules this relies on.

## RED test list
AC IDs must be the spec's AC IDs (or the Spec-lite's) — do not invent a parallel numbering.
- AC1: <behavior in one sentence, from the spec>
  - test file: src/__tests__/<file>.test.js
  - test name: "<reads like a spec line>"
  - seams touched: fs | clock | network | none
  - edge cases: <empty | boundary | invalid input | ...>
- AC2: ...

## Telemetry
None — this repo has no telemetry stack. (State it in one line.)

## Open questions / assumptions
- Q: ...
- Assumption: ...

## Risks
- ...

## Blast radius / breakage prediction
Predict how safe or breaking this change is **before** implementing. Pick one rating and justify it in 1–3 bullets.

- **Rating:** `safe` | `low-risk` | `risky` | `breaking`
  - `safe` — internal-only, no API/schema/config/file-format change, pure refactor or gated bug fix. Rollback = revert one commit.
  - `low-risk` — touches behavior callers can observe, but backward compatible. Existing callers and tests keep working unchanged.
  - `risky` — changes observable behavior in a way that *could* surprise an existing user (new default, renamed export, new required call order) but has a documented migration or fallback.
  - `breaking` — removes/renames a public export, or changes a return shape a caller depends on. Requires a major-version bump and CHANGELOG "BREAKING" entry (both protected paths — a human does those).
- **Who/what could break:** callers of the changed module | tests | CI | docs | none.
- **Detection:** how a regression would show up (test that would fail, log line, user report) — so the reviewer knows what to watch for post-merge.

If the rating is `risky` or `breaking`, the plan MUST also list the migration path and whether a version bump is required before it can be approved.

## Out-of-scope follow-ups
- ...
```

---

## Examples

No plans yet. `docs/plans/done/` holds finished ones.

---

## Relationship to specs

| File | Granularity | Scope | Written in |
|---|---|---|---|
| `docs/specs/<issue>-<topic>.md` | One per issue | WHAT/WHY: behavior + acceptance criteria | Phase 0 (SPEC) — see [docs/specs/README.md](../specs/README.md) |
| `docs/plans/<topic>.md` | One per TDD cycle | Full plan: scope, interface, tests, risks | Phase 1 of the cycle |
