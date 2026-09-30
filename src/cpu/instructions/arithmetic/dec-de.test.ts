import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDecDE } from './dec-de.js';

suite('DEC DE', () => {
  test('decrements DE', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0x56,
      e: 0x78,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const decDE = createDecDE({ registers });

    const cycles = decDE.execute();

    assert.strictEqual(registers.d, 0x56);
    assert.strictEqual(registers.e, 0x77);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0x0000 to 0xffff', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0x00,
      e: 0x00,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const decDE = createDecDE({ registers });

    const cycles = decDE.execute();

    assert.strictEqual(registers.d, 0xff);
    assert.strictEqual(registers.e, 0xff);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
