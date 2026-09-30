import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSwapHL } from './swap-hl.js';

suite('SWAP HL', () => {
  test('swaps upper and lower nibbles', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x00, l: 0x00, sp: 0, pc: 0x0100, ime: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0xab;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createSwapHL({ mmu, registers });
    const cycles = op.execute();
    assert.strictEqual(mmu.read8(0x0000), 0xba);
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.f & 0x10, 0x00); // C clear
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
    const op = createSwapHL({ mmu, registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
