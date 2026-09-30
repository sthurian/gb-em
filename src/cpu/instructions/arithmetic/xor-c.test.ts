import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createXorC } from './xor-c.js';

suite('XOR C', () => {
  test('XORs C with A', () => {
    const registers: Registers = {
      a: 0xff,
      f: 0xff,
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

    const xorC = createXorC({ registers });

    const cycles = xorC.execute();

    assert.strictEqual(registers.a, 0xf0);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is zero', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0x42,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const xorC = createXorC({ registers });

    const cycles = xorC.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0x80);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
