import assert from 'node:assert/strict';
import test from 'node:test';
import { positiveIntegerSetting } from '../src/lib/settings.mjs';

test('accepts a positive integer PR limit', () => {
  assert.equal(positiveIntegerSetting('1', 'PIPELINE_MAX_OPEN_PRS'), 1);
});

test('rejects a missing, zero or non-numeric PR limit', () => {
  assert.throws(() => positiveIntegerSetting('', 'PIPELINE_MAX_OPEN_PRS'), /positive integer/);
  assert.throws(() => positiveIntegerSetting('0', 'PIPELINE_MAX_OPEN_PRS'), /positive integer/);
  assert.throws(() => positiveIntegerSetting('many', 'PIPELINE_MAX_OPEN_PRS'), /positive integer/);
});
