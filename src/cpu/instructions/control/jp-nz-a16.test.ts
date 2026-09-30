import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createJpNzA16 } from './jp-nz-a16.js';

suite('JP NZ,a16', () => {
  test('jumps to the specified address when Z flag is clear', () => {
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

    const jpNzA16 = createJpNzA16({ mmu, registers });

    const cycles = jpNzA16.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(cycles, 16);
  });

  test('does not jump when Z flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x80,
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

    const jpNzA16 = createJpNzA16({ mmu, registers });

    const cycles = jpNzA16.execute();

    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});
