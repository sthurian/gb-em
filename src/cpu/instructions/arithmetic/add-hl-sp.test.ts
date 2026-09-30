import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddHLSP } from './add-hl-sp.js';

suite('ADD HL,SP', () => {
  test('adds SP to HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x00,
      l: 0x10,
      sp: 0x0020,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addHLSP = createAddHLSP({ registers });

    const cycles = addHLSP.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets carry when result overflows 16 bits', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xff,
      l: 0xff,
      sp: 0x0001,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addHLSP = createAddHLSP({ registers });

    addHLSP.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.f & 0x10, 0x10); // carry set
  });
});
