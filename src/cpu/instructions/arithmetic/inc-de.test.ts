import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createIncDE } from './inc-de.js';

suite('INC DE', () => {
  test('increments DE', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0x12,
      e: 0x34,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const incDE = createIncDE({ registers });

    const cycles = incDE.execute();

    assert.strictEqual(registers.d, 0x12);
    assert.strictEqual(registers.e, 0x35);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0xff,
      e: 0xff,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const incDE = createIncDE({ registers });

    const cycles = incDE.execute();

    assert.strictEqual(registers.d, 0x00);
    assert.strictEqual(registers.e, 0x00);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});
