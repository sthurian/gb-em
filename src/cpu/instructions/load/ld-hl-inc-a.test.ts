import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdHlIncA } from './ld-hl-inc-a.js';

suite('LD (HL+),A', () => {
  test('stores A at (HL) and increments HL', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xc0,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const xorA = createLdHlIncA({ mmu, registers });

    const cycles = xorA.execute();

    assert.strictEqual(mmu.read8(0xc000), 0x42);
    assert.strictEqual(registers.h, 0xc0);
    assert.strictEqual(registers.l, 0x01);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps HL from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0x99,
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
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const xorA = createLdHlIncA({ mmu, registers });

    const cycles = xorA.execute();

    assert.strictEqual(mmu.read8(0xffff), 0x99);
    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
