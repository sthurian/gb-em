import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createBit6B } from './bit-6-b.js';

suite('BIT 6,B', () => {
  test('clears Z when bit is set', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0x40, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createBit6B({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.f & 0x20, 0x20); // H set
    assert.strictEqual(registers.f & 0x40, 0x00); // N clear
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets Z when bit is clear', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const mmu = mmuFactory.build();
    const op = createBit6B({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80); // Z set
    assert.strictEqual(registers.f & 0x20, 0x20); // H set
  });
});
