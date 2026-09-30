import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSubC } from './sub-c.js';

suite('SUB C', () => {
  test('subtracts C from A', () => {
    const registers: Registers = {
      a: 0x20,
      f: 0xff,
      b: 0,
      c: 0x05,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const subC = createSubC({ registers });

    const cycles = subC.execute();

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
      c: 0x42,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const subC = createSubC({ registers });

    subC.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });
});
