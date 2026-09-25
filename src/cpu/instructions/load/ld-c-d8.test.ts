import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createMMU } from '../../../mmu.js';
import { createLdCD8 } from './ld-c-d8.js';
import { mmuFactory } from '../../../test-factories/mmu.js';

suite('LD C,d8', () => {
  test('loads the immediate value into C', () => {
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

    mmu.write8(0x101, 0x42);

    const ldCD8 = createLdCD8({ mmu, registers });

    const cycles = ldCD8.execute();

    assert.strictEqual(cycles, 8);
    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x102);
  });

  test('wraps the immediate operand address', () => {
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
      pc: 0xffff,
    };

    mmu.write8(0x0000, 0x42);

    const ldCD8 = createLdCD8({ mmu, registers });

    ldCD8.execute();

    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x0001);
  });
});