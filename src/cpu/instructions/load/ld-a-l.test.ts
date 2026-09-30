import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAL } from './ld-a-l.js';

suite('LD A,L', () => {
  test('loads L into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x42,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const ldAL = createLdAL({
      registers,
    });

    const cycles = ldAL.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});