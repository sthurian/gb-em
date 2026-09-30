import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRes6H } from './res-6-h.js';

suite('RES 6,H', () => {
  test('clears bit 6', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      h: 0xff,
    };
    const mmu = mmuFactory.build();
    const op = createRes6H({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.h, 0xbf);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
