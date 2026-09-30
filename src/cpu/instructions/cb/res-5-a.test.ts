import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRes5A } from './res-5-a.js';

suite('RES 5,A', () => {
  test('clears bit 5', () => {
    const registers: Registers = {
      a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRes5A({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.a, 0xdf);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
