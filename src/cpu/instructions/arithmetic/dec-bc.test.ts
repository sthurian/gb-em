import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDecBC } from './dec-bc.js';

suite('DEC BC', () => {
  test('decrements BC', () => {
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

    const decBC = createDecBC({ registers });

    const cycles = decBC.execute();

    assert.strictEqual(registers.b, 0x12);
    assert.strictEqual(registers.c, 0x33);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0x0000 to 0xffff', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0x00,
      c: 0x00,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const decBC = createDecBC({ registers });

    const cycles = decBC.execute();

    assert.strictEqual(registers.b, 0xff);
    assert.strictEqual(registers.c, 0xff);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
