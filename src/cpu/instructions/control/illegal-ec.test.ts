import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xEC } from './illegal-ec.js';

suite('illegal opcode 0xEC', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xEC({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
