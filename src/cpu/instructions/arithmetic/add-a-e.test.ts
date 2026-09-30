import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddAE } from './add-a-e.js';

suite('ADD A,E', () => {
  test('adds E to A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0x20,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addAE = createAddAE({ registers });
    const cycles = addAE.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets carry flag when result exceeds 0xff', () => {
    const registers: Registers = {
      a: 0xf0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0x20,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addAE = createAddAE({ registers });
    addAE.execute();

    assert.strictEqual(registers.a, 0x10);
    // carry=1 => 0x10
    assert.strictEqual(registers.f, 0x10);
  });

  test('sets half-carry', () => {
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, e: 0x01 };
    createAddAE({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry on overflow', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, e: 0x80 };
    createAddAE({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets zero flag', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, e: 0x80 };
    createAddAE({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
