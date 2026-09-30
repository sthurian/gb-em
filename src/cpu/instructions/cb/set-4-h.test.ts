import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSet4H } from './set-4-h.js';

suite('SET 4,H', () => {
  test('sets bit 4', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createSet4H({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.h & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
