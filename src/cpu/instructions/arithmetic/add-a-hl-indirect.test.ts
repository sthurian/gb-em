import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAddAHLIndirect } from './add-a-hl-indirect.js';

suite('ADD A,(HL)', () => {
  test('adds value at (HL) to A', () => {
    const registers: Registers = {
      a: 0x10,
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
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x20);

    const addAHLIndirect = createAddAHLIndirect({ mmu, registers });
    const cycles = addAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets carry and half-carry flags on overflow', () => {
    const registers: Registers = {
      a: 0xff,
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
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x01);

    const addAHLIndirect = createAddAHLIndirect({ mmu, registers });
    addAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x00);
    // zero=1, halfCarry=1, carry=1 => 0xb0
    assert.strictEqual(registers.f, 0xb0);
  });
});
