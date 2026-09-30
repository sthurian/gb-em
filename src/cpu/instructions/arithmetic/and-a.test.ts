import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAndA } from './and-a.js';

suite('AND A', () => {
  test('ANDs A with A', () => {
    const registers: Registers = {
      a: 0x42,
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

    const andA = createAndA({ registers });
    const cycles = andA.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0x20);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when A is zero', () => {
    const registers: Registers = {
      a: 0,
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

    const andA = createAndA({ registers });
    andA.execute();

    assert.strictEqual(registers.a, 0);
    assert.strictEqual(registers.f, 0xa0);
  });
});
