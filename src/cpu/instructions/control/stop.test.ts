import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createStop } from './stop.js';

suite('STOP', () => {
  test('throws STOP not implemented', () => {
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

    const mmu = mmuFactory.build();
    const stop = createStop({ mmu, registers });

    assert.throws(() => stop.execute(), /STOP not implemented/);
  });
});
