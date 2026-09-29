import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createPopHL } from './pop-hl.js';

suite('POP HL', () => {
  test('pops value from stack into HL', () => {
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

    const memory = new Uint8Array(0x10000);
    memory[0xfffc] = 0x34;
    memory[0xfffd] = 0x12;

    const popHL = createPopHL({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = popHL.execute();

    assert.strictEqual(registers.h, 0x12);
    assert.strictEqual(registers.l, 0x34);
    assert.strictEqual(registers.sp, 0xfffe);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 12);
  });
});