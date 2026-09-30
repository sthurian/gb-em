import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdDeD16 } from './ld-de-d16.js';

suite('LD DE,d16', () => {
  test('loads the 16-bit immediate value into DE', () => {
    const registers: Registers = {
      a: 0,
      f: 0xf0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;

    const ldDeD16 = createLdDeD16({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldDeD16.execute();

    assert.strictEqual(registers.d, 0x12);
    assert.strictEqual(registers.e, 0x34);
    assert.strictEqual(registers.f, 0xf0);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 12);
  });
});