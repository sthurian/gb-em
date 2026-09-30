import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xDB } from './illegal-db.js';

suite('illegal opcode 0xDB', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xDB({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
