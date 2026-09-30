import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAddAL } from './add-a-l.js';

suite('ADD A,L', () => {
  test('adds L to A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x20,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addAL = createAddAL({ registers });
    const cycles = addAL.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets carry and half-carry flags on overflow', () => {
    const registers: Registers = {
      a: 0xff,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x01,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const addAL = createAddAL({ registers });
    addAL.execute();

    assert.strictEqual(registers.a, 0x00);
    // zero=1, halfCarry=1, carry=1 => 0xb0
    assert.strictEqual(registers.f, 0xb0);
  });
});
