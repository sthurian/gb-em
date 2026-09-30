import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSubA } from './sub-a.js';

suite('SUB A', () => {
  test('subtracts A from A yielding zero', () => {
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
      imeScheduled: false,
    };

    const subA = createSubA({ registers });

    const cycles = subA.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero and N flags for any value of A', () => {
    const registers: Registers = {
      a: 0xff,
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

    const subA = createSubA({ registers });

    subA.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('A sub A sets Z and N, clears C', () => {
    const registers: Registers = { a: 0x42, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createSubA({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
    assert.strictEqual(registers.f & 0x40, 0x40);
    assert.strictEqual(registers.f & 0x10, 0x00);
  });
});
