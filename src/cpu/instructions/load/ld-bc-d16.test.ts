import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdBcD16 } from './ld-bc-d16.js';

suite('LD BC,d16', () => {
  test('loads a 16-bit immediate value into BC', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
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

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;

    const ldBcD16 = createLdBcD16({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldBcD16.execute();

    assert.strictEqual(registers.b, 0x12);
    assert.strictEqual(registers.c, 0x34);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});