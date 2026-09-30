import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createRlca } from './rlca.js';

suite('RLCA', () => {
  test('rotates A left and sets C flag when bit 7 is set', () => {
    const registers: Registers = {
      a: 0x85,
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

    const rlca = createRlca({ registers });
    const cycles = rlca.execute();

    assert.strictEqual(registers.a, 0x0b);
    assert.strictEqual(registers.f, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('rotates A left and clears C flag when bit 7 is clear', () => {
    const registers: Registers = {
      a: 0x11,
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

    const rlca = createRlca({ registers });
    const cycles = rlca.execute();

    assert.strictEqual(registers.a, 0x22);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
