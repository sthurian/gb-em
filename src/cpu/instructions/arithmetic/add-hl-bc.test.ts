import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddHLBC } from './add-hl-bc.js';

suite('ADD HL,BC', () => {
  test('adds BC to HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0x12,
      c: 0x34,
      d: 0,
      e: 0,
      h: 0x00,
      l: 0x10,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addHLBC = createAddHLBC({ registers });

    const cycles = addHLBC.execute();

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
      b: 0xff,
      c: 0xff,
      d: 0,
      e: 0,
      h: 0x00,
      l: 0x01,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const addHLBC = createAddHLBC({ registers });

    addHLBC.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.f & 0x10, 0x10); // carry set
  });
});
