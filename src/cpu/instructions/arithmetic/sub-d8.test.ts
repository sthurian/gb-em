import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSubD8 } from './sub-d8.js';

suite('SUB d8', () => {
  test('subtracts immediate from A', () => {
    const registers: Registers = {
      a: 0x20,
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
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x05);

    const subD8 = createSubD8({ mmu, registers });

    const cycles = subD8.execute();

    assert.strictEqual(registers.a, 0x1b);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is zero', () => {
    const registers: Registers = {
      a: 0x42,
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

    const subD8 = createSubD8({ mmu, registers });

    subD8.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets half carry flag', () => {
    const registers: Registers = {
      a: 0x10,
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
    mmu.write8(0x0101, 0x01);

    const subD8 = createSubD8({ mmu, registers });

    subD8.execute();

    assert.strictEqual(registers.a, 0x0f);
    assert.strictEqual(registers.f, 0x60);
  });

  test('sets carry flag when result underflows', () => {
    const registers: Registers = {
      a: 0x00,
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
    mmu.write8(0x0101, 0x01);

    const subD8 = createSubD8({ mmu, registers });

    subD8.execute();

    assert.strictEqual(registers.a, 0xff);
    assert.strictEqual(registers.f, 0x70);
  });
});
