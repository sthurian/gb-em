import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createOrL } from './or-l.js';

suite('OR L', () => {
  test('ORs L with A', () => {
    const registers: Registers = {
      a: 0x0f,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0xf0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const orL = createOrL({ registers });
    const cycles = orL.execute();

    assert.strictEqual(registers.a, 0xff);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is zero', () => {
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
      imeScheduled: false,
    };

    const orL = createOrL({ registers });
    orL.execute();

    assert.strictEqual(registers.a, 0);
    assert.strictEqual(registers.f, 0x80);
  });
});
