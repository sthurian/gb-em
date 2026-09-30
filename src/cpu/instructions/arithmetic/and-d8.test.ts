import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAndD8 } from './and-d8.js';

suite('AND d8', () => {
  test('ANDs d8 with A', () => {
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
    mmu.write8(0x0101, 0x0f);

    const andD8 = createAndD8({ mmu, registers });

    const cycles = andD8.execute();

    assert.strictEqual(registers.a, 0x0f);
    assert.strictEqual(registers.f, 0x20); // H set
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is zero', () => {
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
    mmu.write8(0x0101, 0x0f);

    const andD8 = createAndD8({ mmu, registers });

    const cycles = andD8.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xa0); // Z and H set
    assert.strictEqual(cycles, 8);
  });
});
