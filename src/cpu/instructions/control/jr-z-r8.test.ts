
import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createJrZ } from './jr-z-r8.js';

suite('JR Z,r8', () => {
  test('jumps when the zero flag is set', () => {
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

    const jrZ = createJrZ({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = jrZ.execute();

    assert.strictEqual(registers.pc, 0x0107);
    assert.strictEqual(cycles, 12);
  });

  test('does not jump when the zero flag is clear', () => {
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

    const jrZ = createJrZ({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = jrZ.execute();

    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('jumps with negative offset when Z flag is set', () => {
    const registers: Registers = { a: 0, f: 0x80, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0xfe; // -2 signed
    const jrZ = createJrZ({ mmu: mmuFactory.build({}, { transient: { memory } }), registers });
    jrZ.execute();
    assert.strictEqual(registers.pc, 0x0100);
  });
});
