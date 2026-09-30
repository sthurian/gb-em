import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAIndirectDe } from './ld-a-indirect-de.js';

suite('LD A,(DE)', () => {
  test('loads A from the address in DE', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0xf0,
      b: 0,
      c: 0,
      d: 0x12,
      e: 0x34,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x1234] = 0x42;

    const ldAIndirectDe = createLdAIndirectDe({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldAIndirectDe.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.f, 0xf0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});