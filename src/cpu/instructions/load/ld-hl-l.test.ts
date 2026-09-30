import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdHLL } from './ld-hl-l.js';

suite('LD (HL),L', () => {
  test('stores L at the address in HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0xf0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const ldHLL = createLdHLL({ mmu, registers });

    const cycles = ldHLL.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x34);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
