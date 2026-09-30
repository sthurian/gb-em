import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSwapC } from './swap-c.js';

suite('SWAP C', () => {
  test('swaps upper and lower nibbles', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0xab, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createSwapC({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.c, 0xba);
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.f & 0x10, 0x00); // C clear
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createSwapC({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
