#!/usr/bin/env node
/**
 * Stub of the parent project's scripts/generate-telemetry-config-ci.js.
 * The League runs this as a pre_build step. The sandbox has no telemetry, so
 * it just writes an ignored placeholder file and exits 0.
 */

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src');
const filePath = path.join(dir, 'telemetryConfig.generated.js');

fs.mkdirSync(dir, { recursive: true });

const content = `/**
 * GENERATED FILE - DO NOT EDIT MANUALLY
 * league-sandbox stub - no telemetry (dev mode)
 */
module.exports = { TELEMETRY_CONNECTION_STRING: '' };
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✓ Generated ${path.relative(path.join(__dirname, '..'), filePath)} (stub - no telemetry)`);
