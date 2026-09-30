import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdAHlInc } from './ld-a-hl-inc.js';

suite('LD A,(HL+)', () => {
  test('loads the value at HL into A and increments HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0xff,
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
    memory[0x1234] = 0x42;

    const ldAHlInc = createLdAHlInc({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldAHlInc.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.h, 0x12);
    assert.strictEqual(registers.l, 0x35);
    assert.strictEqual(registers.f, 0xff);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('wraps HL from 0xffff to 0x0000', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xff,
      l: 0xff,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0xffff] = 0x42;

    const ldAHlInc = createLdAHlInc({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = ldAHlInc.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.h, 0x00);
    assert.strictEqual(registers.l, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });
});