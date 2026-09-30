import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddHLHL } from './add-hl-hl.js';

suite('ADD HL,HL', () => {
  test('doubles HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x10,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addHLHL = createAddHLHL({ registers });

    const cycles = addHLHL.execute();

    assert.strictEqual(registers.h, 0x20);
    assert.strictEqual(registers.l, 0x00);
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
      h: 0x80,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addHLHL = createAddHLHL({ registers });

    addHLHL.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.f & 0x10, 0x10); // carry set
  });
});
