import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncB } from './inc-b.js';

suite('INC B', () => {
  test('increments B', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0x41,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incB = createIncB({ registers });

    const cycles = incB.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.b, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});