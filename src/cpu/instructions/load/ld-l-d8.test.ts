import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdLD8 } from './ld-l-d8.js';

suite('LD L,d8', () => {
  test('loads the immediate value into L', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
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
    mmu.write8(0x0101, 0x42);

    const ldLD8 = createLdLD8({ mmu, registers });

    const cycles = ldLD8.execute();

    assert.strictEqual(registers.l, 0x42);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('loads a different immediate value into L', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
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
    mmu.write8(0x0201, 0xff);

    const ldLD8 = createLdLD8({ mmu, registers });

    const cycles = ldLD8.execute();

    assert.strictEqual(registers.l, 0xff);
    assert.strictEqual(registers.pc, 0x0202);
    assert.strictEqual(cycles, 8);
  });
});
