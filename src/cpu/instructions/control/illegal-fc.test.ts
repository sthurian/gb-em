import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xFC } from './illegal-fc.js';

suite('illegal opcode 0xFC', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xFC({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
