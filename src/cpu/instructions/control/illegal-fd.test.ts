import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xFD } from './illegal-fd.js';

suite('illegal opcode 0xFD', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xFD({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
