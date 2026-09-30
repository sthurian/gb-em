import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createCallNz } from './call-nz-a16.js';

suite('CALL NZ,a16', () => {
  test('calls when Z flag is clear', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;

    const callNz = createCallNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = callNz.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(registers.sp, 0xfffc);
    assert.strictEqual(memory[0xfffc], 0x03);
    assert.strictEqual(memory[0xfffd], 0x01);
    assert.strictEqual(cycles, 24);
  });

  test('does not call when Z flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x80,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);

    const callNz = createCallNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = callNz.execute();

    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(registers.sp, 0xfffe);
    assert.strictEqual(cycles, 12);
  });

  test('does not modify flags', () => {
    const registers: Registers = {
      a: 0,
      f: 0x50,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;

    const callNz = createCallNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    callNz.execute();

    assert.strictEqual(registers.f, 0x50);
  });
});