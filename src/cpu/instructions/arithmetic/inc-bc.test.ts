import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createIncBC } from './inc-bc.js';

suite('INC BC', () => {
  test('increments BC', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0x12,
      c: 0x34,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const incBC = createIncBC({ registers });

    const cycles = incBC.execute();

    assert.strictEqual(registers.b, 0x12);
    assert.strictEqual(registers.c, 0x35);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0xff,
      c: 0xff,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const incBC = createIncBC({ registers });

    const cycles = incBC.execute();

    assert.strictEqual(registers.b, 0x00);
    assert.strictEqual(registers.c, 0x00);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});