import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSbcAHLIndirect } from './sbc-a-hl-indirect.js';

suite('SBC A,(HL)', () => {
  test('subtracts value at (HL) from A without carry', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xc0,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x10);

    const sbcAHLIndirect = createSbcAHLIndirect({ mmu, registers });
    const cycles = sbcAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x20);
    assert.strictEqual(registers.f, 0x40);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('subtracts value at (HL) from A with carry in', () => {
    const registers: Registers = {
      a: 0x30,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0xc0,
      l: 0x00,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x10);

    const sbcAHLIndirect = createSbcAHLIndirect({ mmu, registers });
    const cycles = sbcAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x1f);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets carry when borrow', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x10;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x01, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createSbcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });

  test('sets half-carry when lower nibble borrows', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x01;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x10, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createSbcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets zero flag when result is 0', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x05;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x05, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createSbcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
