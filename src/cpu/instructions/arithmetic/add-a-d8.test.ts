import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAddAD8 } from './add-a-d8.js';

suite('ADD A,d8', () => {
  test('adds immediate to A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0xff,
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
    mmu.write8(0x0101, 0x05);

    const addAD8 = createAddAD8({ mmu, registers });

    const cycles = addAD8.execute();

    assert.strictEqual(registers.a, 0x15);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is zero', () => {
    const registers: Registers = {
      a: 0xff,
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
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x01);

    const addAD8 = createAddAD8({ mmu, registers });

    addAD8.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xb0);
  });

  test('sets half carry flag', () => {
    const registers: Registers = {
      a: 0x0f,
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
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x01);

    const addAD8 = createAddAD8({ mmu, registers });

    addAD8.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x20);
  });

  test('sets carry flag', () => {
    const registers: Registers = {
      a: 0xf0,
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
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x20);

    const addAD8 = createAddAD8({ mmu, registers });

    addAD8.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x10);
  });
});
