import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddHLDE } from './add-hl-de.js';

suite('ADD HL,DE', () => {
  test('adds DE to HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0x12,
      e: 0x34,
      h: 0x00,
      l: 0x10,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addHLDE = createAddHLDE({ registers });

    const cycles = addHLDE.execute();

    assert.strictEqual(registers.h, 0x12);
    assert.strictEqual(registers.l, 0x44);
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
      d: 0xff,
      e: 0xff,
      h: 0x00,
      l: 0x01,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addHLDE = createAddHLDE({ registers });

    addHLDE.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.f & 0x10, 0x10); // carry set
  });
});
