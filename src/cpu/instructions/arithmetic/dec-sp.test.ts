import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDecSP } from './dec-sp.js';

suite('DEC SP', () => {
  test('decrements SP', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x1234,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const decSP = createDecSP({ registers });

    const cycles = decSP.execute();

    assert.strictEqual(registers.sp, 0x1233);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0x0000 to 0xffff', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x0000,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const decSP = createDecSP({ registers });

    const cycles = decSP.execute();

    assert.strictEqual(registers.sp, 0xffff);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
