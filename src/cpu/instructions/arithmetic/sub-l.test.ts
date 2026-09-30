import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSubL } from './sub-l.js';

suite('SUB L', () => {
  test('subtracts L from A', () => {
    const registers: Registers = {
      a: 0x20,
      f: 0xff,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x05,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const subL = createSubL({ registers });

    const cycles = subL.execute();

    assert.strictEqual(registers.a, 0x1b);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero and N flags when result is zero', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x42,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const subL = createSubL({ registers });

    subL.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets carry when value > A', () => {
    const registers: Registers = { a: 0x01, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, l: 0x10 };
    createSubL({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
