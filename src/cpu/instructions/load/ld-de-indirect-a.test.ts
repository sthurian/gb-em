import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdDeIndirectA } from './ld-de-indirect-a.js';

suite('LD (DE),A', () => {
  test('writes A to the address stored in DE', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0x12,
      e: 0x34,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    const ldDeIndirectA = createLdDeIndirectA({ mmu, registers });

    const cycles = ldDeIndirectA.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('writes A to a different address in DE', () => {
    const registers: Registers = {
      a: 0x77,
      f: 0,
      b: 0,
      c: 0,
      d: 0xc0,
      e: 0x05,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
    };

    const mmu = mmuFactory.build();
    const ldDeIndirectA = createLdDeIndirectA({ mmu, registers });

    const cycles = ldDeIndirectA.execute();

    assert.strictEqual(mmu.read8(0xc005), 0x77);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
