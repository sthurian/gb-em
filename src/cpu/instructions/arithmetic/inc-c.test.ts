import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncC } from './inc-c.js';

suite('INC C', () => {
  test('increments C', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0x41,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incC = createIncC({ registers });

    const cycles = incC.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});