import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createJrCR8 } from './jr-c-r8.js';

suite('JR C,r8', () => {
  test('jumps when C flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x10,
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

    const jrCR8 = createJrCR8({
      mmu: mmuFactory.build({}, { transient: { memory } }),
      registers,
    });

    const cycles = jrCR8.execute();

    assert.strictEqual(registers.pc, 0x0107);
    assert.strictEqual(cycles, 12);
  });

  test('does not jump when C flag is clear', () => {
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

    const jrCR8 = createJrCR8({
      mmu: mmuFactory.build({}, { transient: { memory } }),
      registers,
    });

    const cycles = jrCR8.execute();

    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });
});
