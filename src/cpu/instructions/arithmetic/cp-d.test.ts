import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCpD } from './cp-d.js';

suite('CP D', () => {
  test('does not modify A, sets N and C when D is greater than A', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0,
      b: 0,
      c: 0,
      d: 0x20,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpD = createCpD({ registers });

    const cycles = cpD.execute();

    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f, 0x50);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets Z and N when A equals D', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0x42,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const cpD = createCpD({ registers });

    cpD.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xc0);
  });
});
