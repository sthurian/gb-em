import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createIncA } from './inc-a.js';

suite('INC A', () => {
  test('increments A', () => {
    const registers = {
      a: 0x41,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    const incA = createIncA({ registers });

    const cycles = incA.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
});