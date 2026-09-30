import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRes6L } from './res-6-l.js';

suite('RES 6,L', () => {
  test('clears bit 6', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      l: 0xff,
    };
    const mmu = mmuFactory.build();
    const op = createRes6L({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.l, 0xbf);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
