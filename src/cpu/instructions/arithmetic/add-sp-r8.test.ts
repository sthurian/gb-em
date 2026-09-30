import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAddSpR8 } from './add-sp-r8.js';

suite('ADD SP,r8', () => {
  test('adds a positive offset to SP', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x0010,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x05);

    const addSpR8 = createAddSpR8({ mmu, registers });

    const cycles = addSpR8.execute();

    assert.strictEqual(registers.sp, 0x0015);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 16);
  });

  test('adds a negative offset to SP', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x0010,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0xfe); // -2 as signed byte

    const addSpR8 = createAddSpR8({ mmu, registers });

    const cycles = addSpR8.execute();

    assert.strictEqual(registers.sp, 0x000e);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 16);
  });

  test('sets half-carry flag when nibble overflows', () => {
    const registers: Registers = { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0x000f, pc: 0x0100, ime: false };
    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x01);
    createAddSpR8({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry flag when byte overflows', () => {
    const registers: Registers = { a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0x00ff, pc: 0x0100, ime: false };
    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x01);
    createAddSpR8({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
