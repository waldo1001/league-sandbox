'use strict';

const { add } = require('../math');

describe('add', () => {
    it('adds two positive numbers', () => {
        expect(add(2, 3)).toBe(5);
    });

    it('handles negatives and zero', () => {
        expect(add(-2, 2)).toBe(0);
        expect(add(0, 0)).toBe(0);
    });
});
