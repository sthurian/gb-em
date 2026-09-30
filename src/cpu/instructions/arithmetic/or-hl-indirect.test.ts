import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createOrHLIndirect } from './or-hl-indirect.js';

suite('OR (HL)', () => {
  test('ORs value at (HL) with A', () => {
    const registers: Registers = {
      a: 0x0f,
      f: 0xff,
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
    mmu.write8(0xc000, 0xf0);

    const orHLIndirect = createOrHLIndirect({ mmu, registers });
    const cycles = orHLIndirect.execute();

    assert.strictEqual(registers.a, 0xff);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is zero', () => {
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
    mmu.write8(0xc000, 0x00);

    const orHLIndirect = createOrHLIndirect({ mmu, registers });
    orHLIndirect.execute();

    assert.strictEqual(registers.a, 0);
    assert.strictEqual(registers.f, 0x80);
  });
});
