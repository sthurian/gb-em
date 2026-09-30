import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAB } from './ld-a-b.js';

suite('LD A,B', () => {
  test('loads B into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0xff,
      b: 0x42,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const ldAB = createLdAB({ registers });

    const cycles = ldAB.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});