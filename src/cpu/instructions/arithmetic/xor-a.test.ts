import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createXorA } from './xor-a.js';

suite('XOR A', () => {
  test('XORs A with A (always zero)', () => {
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

    const xorA = createXorA({ registers });

    const cycles = xorA.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0x80);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
