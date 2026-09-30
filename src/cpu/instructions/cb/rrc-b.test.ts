import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRrcB } from './rrc-b.js';

suite('RRC B', () => {
  test('rotates right and sets carry from bit 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0b10110101, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRrcB({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.b, 0b11011010);
    assert.strictEqual(registers.f & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRrcB({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
