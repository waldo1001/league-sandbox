#!/usr/bin/env node
/**
 * Stub of the parent project's scripts/generate-kb-index.js.
 * The sandbox has no knowledge base. This writes an empty, ignored index
 * (knowledge-base/index.json) so the League's `npm run generate-kb-index`
 * pre_build step exits 0.
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'knowledge-base');
const output = path.join(outDir, 'index.json');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(output, JSON.stringify({ generated: 'stub', articles: [] }, null, 2) + '\n', 'utf8');

console.log(`✓ Wrote ${path.relative(path.join(__dirname, '..'), output)} (stub - 0 articles)`);
