import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncD } from './inc-d.js';

suite('INC D', () => {
  test('increments D', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0x41,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incD = createIncD({ registers });

    const cycles = incD.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});