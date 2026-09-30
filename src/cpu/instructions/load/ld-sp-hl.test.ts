import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdSpHL } from './ld-sp-hl.js';

suite('LD SP,HL', () => {
  test('copies HL into SP', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
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

    const ldSpHL = createLdSpHL({ registers });

    const cycles = ldSpHL.execute();

    assert.strictEqual(registers.sp, 0x1234);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('copies a different HL value into SP', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xff,
      l: 0xfe,
      sp: 0,
      pc: 0x0200,
      ime: false,
    };

    const ldSpHL = createLdSpHL({ registers });

    const cycles = ldSpHL.execute();

    assert.strictEqual(registers.sp, 0xfffe);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
