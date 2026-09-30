import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRes1B } from './res-1-b.js';

suite('RES 1,B', () => {
  test('clears bit 1', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      b: 0xff,
    };
    const mmu = mmuFactory.build();
    const op = createRes1B({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.b, 0xfd);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
