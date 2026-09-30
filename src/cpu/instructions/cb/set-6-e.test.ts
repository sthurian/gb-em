import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSet6E } from './set-6-e.js';

suite('SET 6,E', () => {
  test('sets bit 6', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createSet6E({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.e & 0x40, 0x40);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
