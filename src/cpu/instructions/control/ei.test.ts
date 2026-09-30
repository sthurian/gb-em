import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createEi } from './ei.js';

suite('EI', () => {
  test('sets IME to true', () => {
    const registers: Registers = {
      a: 0,
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

    const ei = createEi({ registers });

    const cycles = ei.execute();

    assert.strictEqual(registers.ime, true);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('advances PC by 1', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
    };

    const ei = createEi({ registers });

    ei.execute();

    assert.strictEqual(registers.pc, 0x0201);
  });
});
