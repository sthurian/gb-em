import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdBcIndirectA } from './ld-bc-indirect-a.js';

suite('LD (BC),A', () => {
  test('writes A to the address stored in BC', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0x12,
      c: 0x34,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const ldBcIndirectA = createLdBcIndirectA({ mmu, registers });

    const cycles = ldBcIndirectA.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('writes A to a different address in BC', () => {
    const registers: Registers = {
      a: 0xff,
      f: 0,
      b: 0xc0,
      c: 0x00,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const ldBcIndirectA = createLdBcIndirectA({ mmu, registers });

    const cycles = ldBcIndirectA.execute();

    assert.strictEqual(mmu.read8(0xc000), 0xff);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
