import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdBE } from './ld-b-e.js';

suite('LD B,E', () => {
  test('loads E into B', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0x42,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const ldBE = createLdBE({ registers });
    const cycles = ldBE.execute();

    assert.strictEqual(registers.b, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
