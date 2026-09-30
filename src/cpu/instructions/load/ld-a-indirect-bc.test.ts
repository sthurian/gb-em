import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdAIndirectBC } from './ld-a-indirect-bc.js';

suite('LD A,(BC)', () => {
  test('loads A from the address stored in BC', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0x12,
      c: 0x34,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x1234, 0x42);

    const ldAIndirectBC = createLdAIndirectBC({ mmu, registers });

    const cycles = ldAIndirectBC.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('loads A from a different address in BC', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0xc0,
      c: 0x00,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x99);

    const ldAIndirectBC = createLdAIndirectBC({ mmu, registers });

    const cycles = ldAIndirectBC.execute();

    assert.strictEqual(registers.a, 0x99);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
