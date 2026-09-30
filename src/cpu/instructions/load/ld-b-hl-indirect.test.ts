import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdBHLIndirect } from './ld-b-hl-indirect.js';

suite('LD B,(HL)', () => {
  test('loads value at (HL) into B', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xc0,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x42);

    const ldBHLIndirect = createLdBHLIndirect({ mmu, registers });
    const cycles = ldBHLIndirect.execute();

    assert.strictEqual(registers.b, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
