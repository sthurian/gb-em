import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdA16Sp } from './ld-a16-sp.js';

suite('LD (a16),SP', () => {
  test('writes SP low byte to (a16) and high byte to (a16+1)', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x1234,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x00);
    mmu.write8(0x0102, 0xc0);

    const ldA16Sp = createLdA16Sp({ mmu, registers });

    const cycles = ldA16Sp.execute();

    assert.strictEqual(mmu.read8(0xc000), 0x34);
    assert.strictEqual(mmu.read8(0xc001), 0x12);
    assert.strictEqual(cycles, 20);
  });

  test('advances PC by 3', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xabcd,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x00);
    mmu.write8(0x0102, 0xd0);

    const ldA16Sp = createLdA16Sp({ mmu, registers });

    ldA16Sp.execute();

    assert.strictEqual(registers.pc, 0x0103);
  });
});
