import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createCbPrefix } from './cb-prefix.js';

suite('CB prefix', () => {
  test('throws with CB-prefixed opcode message', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x7c);
    const cbPrefix = createCbPrefix({ mmu, registers });
    assert.throws(() => cbPrefix.execute(), /CB-prefixed opcode 0x7c not implemented/);
  });
});
