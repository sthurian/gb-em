import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createOrD8 } from './or-d8.js';

suite('OR d8', () => {
  test('ORs A with the immediate value', () => {
    const registers: Registers = {
      a: 0x40,
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
    memory[0x0101] = 0x0f;

    const orD8 = createOrD8({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = orD8.execute();

    assert.strictEqual(registers.a, 0x4f);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('sets Z when the result is zero', () => {
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
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x00;

    const orD8 = createOrD8({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = orD8.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0x80);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });
});