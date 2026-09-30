import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xE3 } from './illegal-e3.js';

suite('illegal opcode 0xE3', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xE3({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
