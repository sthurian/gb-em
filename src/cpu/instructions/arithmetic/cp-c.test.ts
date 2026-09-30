import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpC } from './cp-c.js';

suite('CP C', () => {
  test('does not modify A, sets N and C when C is greater than A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0,
      b: 0,
      c: 0x20,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpC = createCpC({ registers });

    const cycles = cpC.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x50);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets Z and N when A equals C', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0x42,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpC = createCpC({ registers });

    cpC.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
  });
});
