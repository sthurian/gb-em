import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpA } from './cp-a.js';

suite('CP A', () => {
  test('does not modify A, sets Z and N since A always equals A', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpA = createCpA({ registers });

    const cycles = cpA.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets Z and N when A is zero', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpA = createCpA({ registers });

    cpA.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('A cp A always sets Z and N', () => {
    const registers: Registers = { a: 0x42, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createCpA({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80); // Z
    assert.strictEqual(registers.f & 0x40, 0x40); // N
    assert.strictEqual(registers.f & 0x10, 0x00); // no C
  });
});
