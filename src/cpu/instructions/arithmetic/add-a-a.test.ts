import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddAA } from './add-a-a.js';

suite('ADD A,A', () => {
  test('adds A to itself', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
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

    const addAA = createAddAA({ registers });
    const cycles = addAA.execute();

    assert.strictEqual(registers.a, 0x20);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets carry and half-carry flags when result overflows', () => {
    const registers: Registers = {
      a: 0x88,
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
      imeScheduled: false,
    };

    const addAA = createAddAA({ registers });
    addAA.execute();

    assert.strictEqual(registers.a, 0x10);
    // halfCarry: (0x8+0x8)=0x10 > 0x0f => true, carry: 0x110 > 0xff => true => 0x20 | 0x10 = 0x30
    assert.strictEqual(registers.f, 0x30);
  });

  test('sets half-carry', () => {
    const registers: Registers = { a: 0x08, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAddAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry on overflow', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAddAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets zero flag', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAddAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
