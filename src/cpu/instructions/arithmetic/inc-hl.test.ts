import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createIncHL } from './inc-hl.js';

suite('INC HL', () => {
  test('increments HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const incHL = createIncHL({ registers });

    const cycles = incHL.execute();

    assert.strictEqual(registers.h, 0x12);
    assert.strictEqual(registers.l, 0x35);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xff,
      l: 0xff,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const incHL = createIncHL({ registers });

    const cycles = incHL.execute();

    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.f, 0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});