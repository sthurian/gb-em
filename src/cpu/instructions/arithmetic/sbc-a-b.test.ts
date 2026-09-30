import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSbcAB } from './sbc-a-b.js';

suite('SBC A,B', () => {
  test('subtracts B from A without carry', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x00,
      b: 0x10,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const sbcAB = createSbcAB({ registers });
    const cycles = sbcAB.execute();

    assert.strictEqual(registers.a, 0x20);
    assert.strictEqual(registers.f, 0x40);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('subtracts B from A with carry in', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x10,
      b: 0x10,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const sbcAB = createSbcAB({ registers });
    const cycles = sbcAB.execute();

    assert.strictEqual(registers.a, 0x1f);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
