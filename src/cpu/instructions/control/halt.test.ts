import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createHalt } from './halt.js';

suite('HALT', () => {
  test('throws HALT not implemented', () => {
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

    const halt = createHalt({ registers });

    assert.throws(() => halt.execute(), /HALT not implemented/);
  });
});
