import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpH } from './cp-h.js';

suite('CP H', () => {
  test('does not modify A, sets N and C when H is greater than A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x20,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpH = createCpH({ registers });

    const cycles = cpH.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x50);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets Z and N when A equals H', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x42,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpH = createCpH({ registers });

    cpH.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets carry when value > A', () => {
    const registers: Registers = { a: 0x01, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x10, l: 0, sp: 0, pc: 0x0100, ime: false, };
    createCpH({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets half-carry when lower nibble borrows', () => {
    const registers: Registers = { a: 0x10, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x01, l: 0, sp: 0, pc: 0x0100, ime: false, };
    createCpH({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });
});
