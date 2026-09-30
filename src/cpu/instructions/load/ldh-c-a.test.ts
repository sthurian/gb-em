import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdhCA } from './ldh-c-a.js';

suite('LD (C),A', () => {
  test('writes A to address 0xFF00 + C', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0x10,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const ldhCA = createLdhCA({ mmu, registers });

    const cycles = ldhCA.execute();

    assert.strictEqual(mmu.read8(0xff10), 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('writes A to a different 0xFF00 + C address', () => {
    const registers: Registers = {
      a: 0x99,
      f: 0,
      b: 0,
      c: 0x7f,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const ldhCA = createLdhCA({ mmu, registers });

    const cycles = ldhCA.execute();

    assert.strictEqual(mmu.read8(0xff7f), 0x99);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
