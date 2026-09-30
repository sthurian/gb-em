import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSrlHL } from './srl-hl.js';

suite('SRL HL', () => {
  test('shifts right logical, bit 0 to carry, bit 7 cleared', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x00, l: 0x00, sp: 0, pc: 0x0100, ime: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0b10110101;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createSrlHL({ mmu, registers });
    const cycles = op.execute();
    assert.strictEqual(mmu.read8(0x0000), 0b01011010);
    assert.strictEqual(registers.f & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 16);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0x00;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createSrlHL({ mmu, registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
