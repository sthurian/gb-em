import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdHLB } from './ld-hl-b.js';

suite('LD (HL),B', () => {
  test('stores B at the address in HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0xf0,
      b: 0x42,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    const ldHLB = createLdHLB({ mmu, registers });

    const cycles = ldHLB.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
