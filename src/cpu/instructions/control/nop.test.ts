import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createNop } from './nop.js';

suite('NOP', () => {
  test('advances the program counter and returns 4 cycles', () => {
    const registers = {
      a: 0,
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

    const nop = createNop({ registers });

    const cycles = nop.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.pc, 0x101);
  });

  test('wraps the program counter at 0xffff', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0xffff,
    };

    const nop = createNop({ registers });

    nop.execute();

    assert.strictEqual(registers.pc, 0x0000);
  });
});