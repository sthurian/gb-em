import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddAC } from './add-a-c.js';

suite('ADD A,C', () => {
  test('adds C to A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
      b: 0,
      c: 0x20,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addAC = createAddAC({ registers });
    const cycles = addAC.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets half-carry flag when lower nibble overflows', () => {
    const registers: Registers = {
      a: 0x08,
      f: 0,
      b: 0,
      c: 0x08,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addAC = createAddAC({ registers });
    addAC.execute();

    assert.strictEqual(registers.a, 0x10);
    // halfCarry=1 => 0x20
    assert.strictEqual(registers.f, 0x20);
  });

  test('sets half-carry', () => {
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0x01, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false, };
    createAddAC({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry on overflow', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0x80, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false, };
    createAddAC({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets zero flag', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0x80, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false, };
    createAddAC({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
