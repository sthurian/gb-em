import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncL } from './inc-l.js';

suite('INC L', () => {
  test('increments L', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x41,
      sp: 0,
      pc: 0x100,
    };

    const incL = createIncL({ registers });

    const cycles = incL.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.l, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});