import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createPopDE } from './pop-de.js';

suite('POP DE', () => {
  test('pops DE from the stack', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffc,
      pc: 0x0100,
      ime: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xfffc, 0x34);
    mmu.write8(0xfffd, 0x12);

    const popDE = createPopDE({ mmu, registers });

    const cycles = popDE.execute();

    assert.strictEqual(registers.d, 0x12);
    assert.strictEqual(registers.e, 0x34);
    assert.strictEqual(registers.sp, 0xfffe);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 12);
  });
});
