import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createLdhAC } from './ldh-a-c.js';

suite('LD A,(C)', () => {
  test('reads from address 0xFF00 + C into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0,
      c: 0x10,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xff10, 0x42);

    const ldhAC = createLdhAC({ mmu, registers });

    const cycles = ldhAC.execute();

    assert.strictEqual(registers.a, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('reads from a different 0xFF00 + C address into A', () => {
    const registers: Registers = {
      a: 0x00,
      f: 0,
      b: 0,
      c: 0x7f,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0200,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xff7f, 0x99);

    const ldhAC = createLdhAC({ mmu, registers });

    const cycles = ldhAC.execute();

    assert.strictEqual(registers.a, 0x99);
    assert.strictEqual(registers.pc, 0x0201);
    assert.strictEqual(cycles, 8);
  });
});
