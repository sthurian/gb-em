import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createMMU } from '../../../mmu.js';
import { createLdED8 } from './ld-e-d8.js';
import { mmuFactory } from '../../../test-factories/mmu.js';

suite('LD E,d8', () => {
  test('loads the immediate value into E', () => {
    const mmu = mmuFactory.build();
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x101, 0xab);

    const instruction = createLdED8({ mmu, registers });

    const cycles = instruction.execute();

    assert.strictEqual(registers.e, 0xab);
    assert.strictEqual(registers.pc, 0x102);
    assert.strictEqual(cycles, 8);
  });
});