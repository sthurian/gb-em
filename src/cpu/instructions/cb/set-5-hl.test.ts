import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSet5HL } from './set-5-hl.js';

suite('SET 5,HL', () => {
  test('sets bit 5', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x00, l: 0x00, sp: 0, pc: 0x0100, ime: false,
    };
    const memory = new Uint8Array(0x10000);
    memory[0x0000] = 0x00;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const op = createSet5HL({ mmu, registers });
    const cycles = op.execute();
    assert.strictEqual(mmu.read8(0x0000) & 0x20, 0x20);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 16);
  });
});
