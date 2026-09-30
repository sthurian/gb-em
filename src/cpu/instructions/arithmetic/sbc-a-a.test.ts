import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSbcAA } from './sbc-a-a.js';

suite('SBC A,A', () => {
  test('subtracts A from A without carry', () => {
    const registers: Registers = {
      a: 0x10,
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

    const sbcAA = createSbcAA({ registers });
    const cycles = sbcAA.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('subtracts A from A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
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

    const sbcAA = createSbcAA({ registers });
    const cycles = sbcAA.execute();

    assert.strictEqual(registers.a, 0xff);
    assert.strictEqual(registers.f, 0x70);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
