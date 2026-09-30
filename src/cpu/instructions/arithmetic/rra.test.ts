import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createRra } from './rra.js';

suite('RRA', () => {
  test('rotates A right through carry and sets C flag when bit 0 is set', () => {
    const registers: Registers = {
      a: 0x81,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const rra = createRra({ registers });
    const cycles = rra.execute();

    assert.strictEqual(registers.a, 0x40);
    assert.strictEqual(registers.f, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('rotates A right through carry and clears C flag when bit 0 is clear', () => {
    const registers: Registers = {
      a: 0x3a,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const rra = createRra({ registers });
    const cycles = rra.execute();

    assert.strictEqual(registers.a, 0x9d);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
