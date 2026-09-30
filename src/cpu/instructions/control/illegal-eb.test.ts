import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xEB } from './illegal-eb.js';

suite('illegal opcode 0xEB', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xEB({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
