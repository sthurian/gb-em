import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRes2E } from './res-2-e.js';

suite('RES 2,E', () => {
  test('clears bit 2', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      e: 0xff,
    };
    const mmu = mmuFactory.build();
    const op = createRes2E({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.e, 0xfb);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
