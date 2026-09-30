import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpB } from './cp-b.js';

suite('CP B', () => {
  test('does not modify A, sets N and C when B is greater than A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0,
      b: 0x20,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpB = createCpB({ registers });

    const cycles = cpB.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x50);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets Z and N when A equals B', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
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

    const cpB = createCpB({ registers });

    cpB.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets carry when value > A', () => {
    const registers: Registers = { a: 0x01, f: 0, b: 0x10, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, };
    createCpB({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets half-carry when lower nibble borrows', () => {
    const registers: Registers = { a: 0x10, f: 0, b: 0x01, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, };
    createCpB({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });
});
