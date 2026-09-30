import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createJrNz } from './jr-nz-r8.js';

suite('JR NZ,r8', () => {
  test('jumps when Z flag is clear', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
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
    memory[0x0101] = 0x05;

    const jrNz = createJrNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = jrNz.execute();

    assert.strictEqual(registers.pc, 0x0107);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(cycles, 12);
  });

  test('does not jump when Z flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x80,
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
    memory[0x0101] = 0x05;

    const jrNz = createJrNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = jrNz.execute();

    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(registers.f, 0x80);
    assert.strictEqual(cycles, 8);
  });

  test('uses a signed negative offset', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0105,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0106] = 0xfb;

    const jrNz = createJrNz({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = jrNz.execute();

    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 12);
  });
});