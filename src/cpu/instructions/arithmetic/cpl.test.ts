import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpl } from './cpl.js';

suite('CPL', () => {
  test('inverts A and sets N and H flags', () => {
    const registers: Registers = {
      a: 0b10110001,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const cpl = createCpl({ registers });

    const cycles = cpl.execute();

    assert.strictEqual(registers.a, 0b01001110);
    assert.strictEqual(registers.f, 0x60); // N and H set
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('preserves Z and C flags', () => {
    const registers: Registers = {
      a: 0x0f,
      f: 0x90, // Z and C set
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const cpl = createCpl({ registers });

    cpl.execute();

    assert.strictEqual(registers.a, 0xf0);
    assert.strictEqual(registers.f, 0xf0); // Z, N, H, C all set
  });
});
