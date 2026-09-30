import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAD } from './ld-a-d.js';

suite('LD A,D', () => {
  test('loads D into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0xff,
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

    const ldAD = createLdAD({ registers });

    const cycles = ldAD.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
