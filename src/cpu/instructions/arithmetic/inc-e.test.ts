import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncE } from './inc-e.js';

suite('INC E', () => {
  test('increments E', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0x41,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incE = createIncE({ registers });

    const cycles = incE.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.e, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});