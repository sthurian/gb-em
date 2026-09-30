import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIllegal0xD3 } from './illegal-d3.js';

suite('illegal opcode 0xD3', () => {
  test('throws illegal opcode', () => {
    const op = createIllegal0xD3({});
    assert.throws(() => op.execute(), /illegal opcode/);
  });
});
