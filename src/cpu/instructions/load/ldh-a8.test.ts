import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdhA8 } from './ldh-a8.js';

suite('LDH A,(a8)', () => {
  test('loads A from the high-memory address', () => {
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
    memory[0xff42] = 0x37;

    const ldhA8 = createLdhA8({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    memory[0x0101] = 0x42;

    const cycles = ldhA8.execute();

    assert.strictEqual(registers.a, 0x37);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 12);
  });
});