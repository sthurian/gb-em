import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createBit6HL } from './bit-6-hl.js';

suite('BIT 6,HL', () => {
  test('clears Z when bit is set', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x00, l: 0x00, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0x40;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createBit6HL({ mmu, registers });
    const cycles = op.execute();
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.f & 0x20, 0x20); // H set
    assert.strictEqual(registers.f & 0x40, 0x00); // N clear
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 12);
  });

  test('sets Z when bit is clear', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0x00;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createBit6HL({ mmu, registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80); // Z set
    assert.strictEqual(registers.f & 0x20, 0x20); // H set
  });
});
