---
name: security-scan
description: 'Security scan for the league-sandbox repo. Invoked from Phase 8 of the TDD workflow and before anything leaves the machine. Scans for real tenant-style GUIDs, bearer tokens, client secrets and connection strings, untracked secret files, secrets in logs, and high/critical npm audit findings. A finding BLOCKS the cycle - never "note and continue". Use when: finishing a TDD cycle, reviewing a PR, or any time before code leaves the machine.'
---

# /security-scan - league-sandbox security gate

This skill is called from [Phase 8 of the TDD cycle](../../../docs/tdd/methodology.md). It is not a "lint pass" - it is a **gate**. A finding blocks the cycle until the finding is resolved or explicitly allowlisted.

league-sandbox is a throwaway shakedown repo and holds no real secrets by design. The scan exists to prove the gate runs and to catch the day someone pastes a real one in. The checks mirror the parent project (`waldo1001/waldo.BCTelemetryBuddy`), which handles Azure tenant GUIDs, bearer tokens, AAD client secrets and Kusto connection strings.

---

## When to run

- **Phase 8 of every TDD cycle** - mandatory. Before DOCUMENT, before telling the user "ready to review".
- **When adding a new test fixture** - fixtures are the #1 source of real-secret leaks.
- **When adding logging or error handling** - messages are the #2 source.

If you are ever unsure whether the scan is needed, run it. It is cheap.

---

## What it scans

### 1. Real tenant / app GUIDs outside allowlisted docs

Azure tenant IDs and app IDs are GUID-shaped. A real one in a committed fixture or test is a leak - the attacker doesn't get a token, but they get a target.

**Pattern:** `[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}`

**Scope:** everything under the repo **except**:
- `src/__tests__/**` - test files may use a known-fake GUID (see allowlist below)
- `docs/**` - documentation may reference the known-fake GUID as an example
- `.claude/skills/security-scan/allowlist.txt` - the allowlist file itself
- `node_modules/**`, `package-lock.json`

**Allowlisted GUID format:** fake GUIDs used in examples must be listed in `.claude/skills/security-scan/allowlist.txt`. A GUID not in the allowlist is treated as real.

### 2. Bearer tokens and access tokens

**Patterns:**
- JWT shape: `eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}` - three base64url segments joined by dots
- MSAL cache markers: `homeAccountId`, `cachedAt`, `expiresOn`, `idTokenClaims`
- Azure CLI token markers: `accessToken` with a sibling `expiresOn` in any committed JSON

**Scope:** everything tracked by git. No exceptions.

**Response on hit:** the token is already leaked the moment it lands in a tracked file. **Rotate first, then scrub.** Check commit history (`git log -p -- <file>`) to see how far back the leak goes. If the leaked file was ever pushed, the token must be considered compromised regardless of whether you rewrite history.

### 3. Client secrets and connection strings

**Patterns:**
- `client_secret` / `clientSecret` / `ClientSecret` followed by `=` or `:` and a string
- `AccountKey=` (storage account keys)
- `InstrumentationKey=[0-9a-fA-F]{8}-`
- `Endpoint=https://.*\.(kusto|crm|servicebus)\.windows\.net.*;.*Key=`

**Scope:** everything tracked by git, plus `.env` and `.env.*` files whether tracked or not (they must never exist in the repo - see #5).

### 4. Customer names in committed content

The parent project checks knowledge-base `appliesTo` fields for real customer names. This repo has no knowledge base, so this check covers the whole repo instead: no real customer or company names in specs, plans, fixtures or docs. Placeholders such as `example-customer` are fine.

**Check:** read the diff and the new files; flag proper nouns with company suffixes (`GmbH`, `BV`, `NV`, `AG`, `Ltd`, `Inc`, `SA`).

### 5. Untracked secret-shaped files

Files that must never exist in the repo, tracked or not:

- `.env`, `.env.local`, `.env.*` (except `.env.example` and `.env.*.example`)
- `token-cache.json`, `accounts.json`
- `msal-cache.bin`, `msal-cache.dat`
- `*.pfx`, `*.p12`, `*.pem`

**Check:** `find` the repo root (excluding `node_modules`) for the patterns above. For each hit, a finding - even if `.gitignore` covers it. The goal is to catch the moment a developer creates one, not just the moment they commit it.

### 6. Secrets in logs and error messages

**Check:**
- `grep` for `console.log`, `console.error` whose arguments include `error.message`, `err.stack`, `response.body` - these can leak tokens if the underlying service returns them.
- `grep` for log or error calls that interpolate variables named `token`, `secret`, `password`, `clientId`, `tenantId`, `email`.

This check is heuristic - not every hit is a real finding. But every hit must be **eyeballed by the agent and justified in chat** before the scan passes.

### 7. `npm audit` - high and critical only

```bash
npm audit --audit-level=high
```

**Response on hit:**
- If the finding is in a dev-only dependency (jest and friends) that does not ship anywhere -> note it in the plan file's out-of-scope follow-ups, scan passes.
- If the finding is in a runtime dependency -> scan **fails**. Bump the dep, open an issue, or pin to a fixed version before the cycle can continue. (`package.json` is a protected path - a human makes that change.)

---

## Output format

Report in chat in exactly this shape:

```
SECURITY SCAN: <PASS | FAIL>

Checks:
  1. Tenant / App GUIDs ........ <pass | N findings>
  2. Bearer tokens ............. <pass | N findings>
  3. Secrets / conn strings .... <pass | N findings>
  4. Customer names ............ <pass | N findings>
  5. Untracked secret files .... <pass | N findings>
  6. Secrets in logs/errors .... <pass | N findings | N eyeballed>
  7. npm audit ................. <pass | N high | N critical>

Findings:
  - <check #>: <file:line> - <short description>
  - ...

Allowlist hits (informational, not findings):
  - <file:line> - <pattern> (allowlisted)
```

If any check shows findings, the overall result is **FAIL**. Do not proceed past Phase 8. Do not summarize the scan as "mostly clean". Either the scan passes or it doesn't.

---

## The allowlist

`.claude/skills/security-scan/allowlist.txt` contains patterns that are safe-by-design: known-fake GUIDs, known-fake emails, and similar placeholders.

Format: one entry per line, `#` comments allowed. Matches are exact-string, not regex.

Add entries the first time a real false positive hits - with a comment explaining *why* the value is safe. Do not add wildcards. Do not add entries just to silence the scan.

---

## Rotation protocol (for leaked real tokens)

If check 2 or 3 hits on a **real** token or secret:

1. **Stop.** Do not continue the TDD cycle.
2. **Invalidate the credential first.** Revoke and regenerate it at its source.
3. **Check history:** `git log --all -p -- <file>` to find every commit the secret lived in. If any such commit was ever pushed, assume the secret is compromised - rotation is not optional, it's already too late.
4. **Scrub the file.** Remove the secret, replace with a placeholder, regenerate fixtures if needed.
5. **Tell the user explicitly** what was found, what was rotated, and whether history rewrite is needed. The user decides whether to rewrite git history - the agent does not.
6. **Re-run the scan** from scratch. Only pass is pass.

---

## What this skill does NOT do

- **It does not replace code review.** A human still reads the diff. The scan is a grep-level safety net.
- **It does not scan third-party code** (`node_modules`, build output). Those are out of scope.
- **It does not rewrite git history.** History rewrite is a user-authorized action (Rule 11 - never run git commands without explicit request).
