import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xED } from './illegal-ed.js';

suite('illegal opcode 0xED', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xED({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
