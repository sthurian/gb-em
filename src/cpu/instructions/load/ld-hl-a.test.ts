import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdHlA } from './ld-hl-a.js';

suite('LD (HL),A', () => {
  test('stores A at the address in HL', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0xf0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);

    const ldHlA = createLdHlA({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldHlA.execute();

    assert.strictEqual(memory[0x1234], 0x42);
    assert.strictEqual(registers.f, 0xf0);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});