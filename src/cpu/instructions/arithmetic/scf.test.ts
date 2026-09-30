import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createScf } from './scf.js';

suite('SCF', () => {
  test('sets carry flag and clears N and H', () => {
    const registers: Registers = {
      a: 0,
      f: 0x60, // N and H set
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

    const scf = createScf({ registers });

    const cycles = scf.execute();

    assert.strictEqual(registers.f, 0x10); // only C set
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('preserves Z flag', () => {
    const registers: Registers = {
      a: 0,
      f: 0x80, // Z set
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

    const scf = createScf({ registers });

    scf.execute();

    assert.strictEqual(registers.f, 0x90); // Z and C set
  });
});
