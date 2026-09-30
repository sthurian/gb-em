import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAndE } from './and-e.js';

suite('AND E', () => {
  test('ANDs E with A', () => {
    const registers: Registers = {
      a: 0xff,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0x0f,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const andE = createAndE({ registers });
    const cycles = andE.execute();

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
      c: 0,
      d: 0,
      e: 0x0f,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const andE = createAndE({ registers });
    andE.execute();

    assert.strictEqual(registers.a, 0);
    assert.strictEqual(registers.f, 0xa0);
  });
});
