import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createRrca } from './rrca.js';

suite('RRCA', () => {
  test('rotates A right and sets C flag when bit 0 is set', () => {
    const registers: Registers = {
      a: 0x3b,
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
    };

    const rrca = createRrca({ registers });
    const cycles = rrca.execute();

    assert.strictEqual(registers.a, 0x9d);
    assert.strictEqual(registers.f, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('rotates A right and clears C flag when bit 0 is clear', () => {
    const registers: Registers = {
      a: 0x3a,
      f: 0xf0,
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

    const rrca = createRrca({ registers });
    const cycles = rrca.execute();

    assert.strictEqual(registers.a, 0x1d);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
