import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xDD } from './illegal-dd.js';

suite('illegal opcode 0xDD', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xDD({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
