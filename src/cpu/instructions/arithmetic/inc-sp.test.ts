import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createIncSP } from './inc-sp.js';

suite('INC SP', () => {
  test('increments SP', () => {
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
    };

    const incSP = createIncSP({ registers });

    const cycles = incSP.execute();

    assert.strictEqual(registers.sp, 0x1235);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xffff,
      pc: 0x0100,
      ime: false,
    };

    const incSP = createIncSP({ registers });

    const cycles = incSP.execute();

    assert.strictEqual(registers.sp, 0x0000);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
