import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSlaC } from './sla-c.js';

suite('SLA C', () => {
  test('shifts left, bit 7 goes to carry, bit 0 cleared', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0b10110100, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createSlaC({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.c, 0b01101000);
    assert.strictEqual(registers.f & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createSlaC({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
