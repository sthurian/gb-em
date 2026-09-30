import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRst10h } from './rst-10h.js';

suite('RST 10H', () => {
  test('jumps to 0x0010, pushes return address to stack, decrements SP by 2, takes 16 cycles', () => {
    const mmu = mmuFactory.build();

    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xc002,
      pc: 0x0150,
      ime: false,
    };

    const rst = createRst10h({ mmu, registers });

    const cycles = rst.execute();

    assert.strictEqual(registers.pc, 0x0010);
    assert.strictEqual(registers.sp, 0xc000);
    assert.strictEqual(mmu.read8(0xc000), 0x51);
    assert.strictEqual(mmu.read8(0xc001), 0x01);
    assert.strictEqual(cycles, 16);
  });
});
