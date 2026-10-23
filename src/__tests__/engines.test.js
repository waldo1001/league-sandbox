const semver = require('semver');
const pkg = require('../../package.json');

const RANGE = '^22.23.4 || ^24.22.1 || >=26.12.1';

describe('engines.node floor', () => {
  test('AC1: engines.node equals the patched range', () => {
    expect(pkg.engines.node).toBe(RANGE);
  });

  test('AC2: patched releases satisfy the range', () => {
    for (const v of ['22.23.4', '22.99.0', '24.22.1', '26.12.1', '27.0.0']) {
      expect(semver.satisfies(v, pkg.engines.node)).toBe(true);
    }
  });

  test('AC3: vulnerable or unsupported releases are rejected', () => {
    for (const v of ['20.19.0', '22.23.3', '24.22.0', '26.12.0', '25.0.0']) {
      expect(semver.satisfies(v, pkg.engines.node)).toBe(false);
    }
  });
});
