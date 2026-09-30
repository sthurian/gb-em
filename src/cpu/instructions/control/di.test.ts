import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDi } from './di.js';

suite('DI', () => {
  test('disables interrupts', () => {
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
      pc: 0,
      ime: true,
      imeScheduled: false,
    };

    const di = createDi({ registers });

    const cycles = di.execute();

    assert.strictEqual(registers.ime, false);
    assert.strictEqual(registers.pc, 0x0001);
    assert.strictEqual(cycles, 4);
  });
});