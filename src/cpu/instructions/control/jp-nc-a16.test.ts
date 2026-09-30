import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createJpNcA16 } from './jp-nc-a16.js';

suite('JP NC,a16', () => {
  test('jumps to the specified address when C flag is clear', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x34);
    mmu.write8(0x0102, 0x12);

    const jpNcA16 = createJpNcA16({ mmu, registers });

    const cycles = jpNcA16.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(cycles, 16);
  });

  test('does not jump when C flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();

    const jpNcA16 = createJpNcA16({ mmu, registers });

    const cycles = jpNcA16.execute();

    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});
