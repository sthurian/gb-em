import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createCpHLIndirect } from './cp-hl-indirect.js';

suite('CP (HL)', () => {
  test('does not modify A, sets N and C when (HL) is greater than A', () => {
    const registers: Registers = {
      a: 0x10,
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
    mmu.write8(0xc000, 0x20);

    const cpHLIndirect = createCpHLIndirect({ mmu, registers });

    const cycles = cpHLIndirect.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x50);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets Z and N when A equals (HL)', () => {
    const registers: Registers = {
      a: 0x42,
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

    const cpHLIndirect = createCpHLIndirect({ mmu, registers });

    cpHLIndirect.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
  });
});
