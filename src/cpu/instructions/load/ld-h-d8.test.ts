import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdHD8 } from './ld-h-d8.js';

suite('LD H,d8', () => {
  test('loads immediate into H', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x42);
    const ldHD8 = createLdHD8({ mmu, registers });
    const cycles = ldHD8.execute();
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });
});
