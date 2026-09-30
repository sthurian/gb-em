import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAndC } from './and-c.js';

suite('AND C', () => {
  test('ANDs C with A', () => {
    const registers: Registers = {
      a: 0xff,
      f: 0x00,
      b: 0,
      c: 0x0f,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const andC = createAndC({ registers });
    const cycles = andC.execute();

    assert.strictEqual(registers.a, 0x0f);
    assert.strictEqual(registers.f, 0x20);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is zero', () => {
    const registers: Registers = {
      a: 0xf0,
      f: 0x00,
      b: 0,
      c: 0x0f,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const andC = createAndC({ registers });
    andC.execute();

    assert.strictEqual(registers.a, 0);
    assert.strictEqual(registers.f, 0xa0);
  });
});
