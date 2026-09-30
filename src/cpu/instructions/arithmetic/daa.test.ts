import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDaa } from './daa.js';

suite('DAA', () => {
  test('throws DAA not implemented', () => {
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
    };

    const daa = createDaa({ registers });

    assert.throws(() => daa.execute(), /DAA not implemented/);
  });
});
