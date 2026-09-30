import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xF4 } from './illegal-f4.js';

suite('illegal opcode 0xF4', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xF4({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
