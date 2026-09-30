import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRrB } from './rr-b.js';

suite('RR B', () => {
  test('rotates right through carry', () => {
    const registers: Registers = {
      a: 0, f: 0x10, b: 0b10110100, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRrB({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.b, 0b11011010);
    assert.strictEqual(registers.f & 0x10, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRrB({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('rotates right with carry clear (bit 7 = 0)', () => {
    const registers: Registers = {
      a: 0, f: 0x00, b: 0b10110100, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    createRrB({ registers }).execute();
    assert.strictEqual(registers.b, 0b01011010);
    assert.strictEqual(registers.f & 0x80, 0x00);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0x00, b: 0x00, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    createRrB({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets carry flag when bit 0 is set', () => {
    const registers: Registers = {
      a: 0, f: 0x00, b: 0x03, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    createRrB({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
