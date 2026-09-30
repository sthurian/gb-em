import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCcf } from './ccf.js';

suite('CCF', () => {
  test('clears carry when carry is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x10, // C set
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

    const ccf = createCcf({ registers });

    const cycles = ccf.execute();

    assert.strictEqual(registers.f, 0x00); // C cleared
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets carry when carry is clear', () => {
    const registers: Registers = {
      a: 0,
      f: 0x80, // Z set, C clear
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

    const ccf = createCcf({ registers });

    ccf.execute();

    assert.strictEqual(registers.f, 0x90); // Z and C set
  });
});
