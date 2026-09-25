import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createMMU } from '../../../mmu.js';
import { createIncHL } from './inc-hl.js';
import { mmuFactory } from '../../../test-factories/mmu.js';

suite('INC (HL)', () => {
  test('increments the value at the address in HL', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0x41);

    const incHL = createIncHL({ mmu, registers });

    const cycles = incHL.execute();

    assert.strictEqual(cycles, 12);
    assert.strictEqual(mmu.read8(0x1234), 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });
    test('wraps the value from 0xff to 0x00 and sets the zero flag', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0xff);

    const incHL = createIncHL({ mmu, registers });

    incHL.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x00);
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets the half-carry flag when the lower nibble overflows', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0x0f);

    const incHL = createIncHL({ mmu, registers });

    incHL.execute();

    assert.strictEqual(mmu.read8(0x1234), 0x10);
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('clears the subtract flag', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0x40,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0x41);

    const incHL = createIncHL({ mmu, registers });

    incHL.execute();

    assert.strictEqual(registers.f & 0x40, 0);
  });

  test('preserves the carry flag', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0x41);

    const incHL = createIncHL({ mmu, registers });

    incHL.execute();

    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('clears the zero flag when the result is not zero', () => {
    const mmu = mmuFactory.build();

    const registers = {
      a: 0,
      f: 0x80,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x1234, 0x41);

    const incHL = createIncHL({ mmu, registers });

    incHL.execute();

    assert.strictEqual(registers.f & 0x80, 0);
  });
});