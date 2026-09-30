import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xE4 } from './illegal-e4.js';

suite('illegal opcode 0xE4', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xE4({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
