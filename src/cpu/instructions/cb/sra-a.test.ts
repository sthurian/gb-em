import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSraA } from './sra-a.js';

suite('SRA A', () => {
  test('shifts right, bit 7 preserved (arithmetic), bit 0 to carry', () => {
    const registers: Registers = {
      a: 0b10110101, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createSraA({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.a, 0b11011010);
    assert.strictEqual(registers.f & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createSraA({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
