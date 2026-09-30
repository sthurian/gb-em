import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAIndirectA16 } from './ld-a-indirect-a16.js';

suite('LD A,(a16)', () => {
  test('loads A from the 16-bit address', () => {
    const registers: Registers = {
      a: 0x00,
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
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;
    memory[0x1234] = 0x42;

    const ldAIndirectA16 = createLdAIndirectA16({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldAIndirectA16.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xf0);
    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(cycles, 16);
  });
});