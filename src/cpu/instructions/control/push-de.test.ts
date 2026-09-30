import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createPushDE } from './push-de.js';

suite('PUSH DE', () => {
  test('pushes DE onto the stack', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0x12,
      e: 0x34,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    const pushDE = createPushDE({ mmu, registers });

    const cycles = pushDE.execute();

    assert.strictEqual(mmu.read8(0xfffc), 0x34);
    assert.strictEqual(mmu.read8(0xfffd), 0x12);
    assert.strictEqual(registers.sp, 0xfffc);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 16);
  });
});
