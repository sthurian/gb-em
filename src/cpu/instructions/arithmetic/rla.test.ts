import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createRla } from './rla.js';

suite('RLA', () => {
  test('rotates A left through carry and sets C flag when bit 7 is set', () => {
    const registers: Registers = {
      a: 0x95,
      f: 0x10,
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

    const rla = createRla({ registers });
    const cycles = rla.execute();

    assert.strictEqual(registers.a, 0x2b);
    assert.strictEqual(registers.f, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('rotates A left through carry and clears C flag when bit 7 is clear', () => {
    const registers: Registers = {
      a: 0x11,
      f: 0x00,
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

    const rla = createRla({ registers });
    const cycles = rla.execute();

    assert.strictEqual(registers.a, 0x22);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
