import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createMMU } from '../../../mmu.js';
import { createLdDD8 } from './ld-d-d8.js';

suite('LD D,d8', () => {
  test('loads the immediate value into D', () => {
    const mmu = createMMU();

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

    const ldDD8 = createLdDD8({ mmu, registers });

    const cycles = ldDD8.execute();

    assert.strictEqual(cycles, 8);
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x102);
  });

  test('wraps the immediate operand address', () => {
    const mmu = createMMU();

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

    const ldDD8 = createLdDD8({ mmu, registers });

    ldDD8.execute();

    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x0001);
  });
});