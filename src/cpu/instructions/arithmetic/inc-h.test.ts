import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncH } from './inc-h.js';

suite('INC H', () => {
  test('increments H', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x41,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incH = createIncH({ registers });

    const cycles = incH.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});