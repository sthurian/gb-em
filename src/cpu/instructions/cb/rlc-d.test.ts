import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRlcD } from './rlc-d.js';

suite('RLC D', () => {
  test('rotates left and sets carry from bit 7', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      d: 0b10110100,
    };
    const mmu = mmuFactory.build();
    const op = createRlcD({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.d, 0b01101001);
    assert.strictEqual(registers.f & 0x10, 0x10); // C set
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRlcD({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80); // Z set
    assert.strictEqual(registers.f & 0x10, 0x00); // C clear
  });
});
