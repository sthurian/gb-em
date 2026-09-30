import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdDHLIndirect } from './ld-d-hl-indirect.js';

suite('LD D,(HL)', () => {
  test('loads value at (HL) into D', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0xc0, l: 0x00, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x42);
    const ldDHLIndirect = createLdDHLIndirect({ mmu, registers });
    const cycles = ldDHLIndirect.execute();
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
