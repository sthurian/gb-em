import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAE } from './ld-a-e.js';

suite('LD A,E', () => {
  test('loads E into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0xff,
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

    const ldAE = createLdAE({ registers });

    const cycles = ldAE.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
