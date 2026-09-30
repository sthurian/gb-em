import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createSbcAE } from './sbc-a-e.js';

suite('SBC A,E', () => {
  test('subtracts E from A without carry', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0x10,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const sbcAE = createSbcAE({ registers });
    const cycles = sbcAE.execute();

    assert.strictEqual(registers.a, 0x20);
    assert.strictEqual(registers.f, 0x40);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('subtracts E from A with carry in', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0x10,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const sbcAE = createSbcAE({ registers });
    const cycles = sbcAE.execute();

    assert.strictEqual(registers.a, 0x1f);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
