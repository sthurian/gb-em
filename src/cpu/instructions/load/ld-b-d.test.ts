import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdBD } from './ld-b-d.js';

suite('LD B,D', () => {
  test('loads D into B', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0x42,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const ldBD = createLdBD({ registers });
    const cycles = ldBD.execute();

    assert.strictEqual(registers.b, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
