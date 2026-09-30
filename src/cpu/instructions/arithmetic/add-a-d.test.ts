import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddAD } from './add-a-d.js';

suite('ADD A,D', () => {
  test('adds D to A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0x20,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addAD = createAddAD({ registers });
    const cycles = addAD.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is zero', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0,
      c: 0,
      d: 0x00,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addAD = createAddAD({ registers });
    addAD.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0x80);
  });

  test('sets half-carry', () => {
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, d: 0x01 };
    createAddAD({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry on overflow', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, d: 0x80 };
    createAddAD({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets zero flag', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, d: 0x80 };
    createAddAD({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
