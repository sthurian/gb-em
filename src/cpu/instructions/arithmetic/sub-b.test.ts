import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSubB } from './sub-b.js';

suite('SUB B', () => {
  test('subtracts B from A', () => {
    const registers: Registers = {
      a: 0x20,
      f: 0xff,
      b: 0x05,
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

    const subB = createSubB({ registers });

    const cycles = subB.execute();

    assert.strictEqual(registers.a, 0x1b);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero and N flags when result is zero', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0x42,
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

    const subB = createSubB({ registers });

    subB.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets carry when value > A', () => {
    const registers: Registers = { a: 0x01, f: 0, b: 0x10, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false, };
    createSubB({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
