const fs = require('fs');
const path = require('path');

const EXPECTED = '^22.23.4 || ^24.22.1 || >=26.12.1';
const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8')
);

const parse = (v) => v.split('.').map(Number);
const cmp = (a, b) => {
    for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
};

// Supports only the clause shapes used here: "^X.Y.Z", ">=X.Y.Z", joined by "||".
function satisfies(version, range) {
    const v = parse(version);
    return range.split('||').some((clause) => {
        const c = clause.trim();
        if (c.startsWith('>=')) return cmp(v, parse(c.slice(2))) >= 0;
        if (c.startsWith('^')) {
            const base = parse(c.slice(1));
            return v[0] === base[0] && cmp(v, base) >= 0;
        }
        throw new Error(`unsupported clause: ${c}`);
    });
}

describe('engines.node', () => {
    const range = pkg.engines.node;

    test('declares engines.node as the patched-release range', () => {
        expect(range).toBe(EXPECTED);
    });

    test('accepts 22.23.4, 24.22.1 and 26.12.1', () => {
        for (const v of ['22.23.4', '22.99.0', '24.22.1', '26.12.1', '27.0.0']) {
            expect(satisfies(v, range)).toBe(true);
        }
    });

    test('rejects 20.19.0, 22.23.3, 24.22.0 and 26.12.0', () => {
        for (const v of ['20.19.0', '22.23.3', '24.22.0', '26.12.0', '25.0.0']) {
            expect(satisfies(v, range)).toBe(false);
        }
    });

    test('adds no dependency beyond jest', () => {
        expect(pkg.dependencies).toBeUndefined();
        expect(Object.keys(pkg.devDependencies)).toEqual(['jest']);
    });
});
