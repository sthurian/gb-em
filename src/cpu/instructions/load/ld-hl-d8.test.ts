import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createMMU } from '../../../mmu.js';
import { createLdHLD8 } from './ld-hl-d8.js';

suite('LD (HL),d8', () => {
  test('writes the immediate value to the address in HL', () => {
    const mmu = createMMU();
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x100,
    };

    mmu.write8(0x101, 0xab);

    const instruction = createLdHLD8({ mmu, registers });

    const cycles = instruction.execute();

    assert.strictEqual(mmu.read8(0x1234), 0xab);
    assert.strictEqual(registers.pc, 0x102);
    assert.strictEqual(cycles, 12);
  });
});