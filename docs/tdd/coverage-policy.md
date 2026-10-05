# Coverage policy — league-sandbox

- Run `npm run test:coverage`; Jest enforces the thresholds configured in `package.json` (`jest.coverageThreshold`): 70% statements and lines, 60% branches.
- `npm test` runs the suite without a coverage gate so it stays fast in CI and in the League's TDD loop.
- Excluded from coverage: `scripts/**` and anything under `__tests__/`.
- Never lower a threshold to make a run pass. Add the missing test. `package.json` is a protected path anyway, so a human decides.
