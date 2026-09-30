import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createDaa } from './daa.js';

const makeRegisters = (overrides: Partial<Registers> = {}): Registers => ({
  a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
  ...overrides,
});

suite('DAA', () => {
  test('corrects BCD after addition (lower nibble overflow)', () => {
    // 0x09 + 0x01 = 0x0A → DAA → 0x10
    const registers = makeRegisters({ a: 0x0a, f: 0x00 }); // N=0, H=0, C=0
    const daa = createDaa({ registers });
    const cycles = daa.execute();
    assert.strictEqual(registers.a, 0x10);
    assert.strictEqual(registers.f & 0x80, 0x00); // Z clear
    assert.strictEqual(registers.f & 0x10, 0x00); // C clear
    assert.strictEqual(cycles, 4);
    assert.strictEqual(registers.pc, 0x0101);
  });

  test('corrects BCD after addition (upper nibble overflow)', () => {
    // 0x45 + 0x38 = 0x7D → DAA → 0x83
    const registers = makeRegisters({ a: 0x7d, f: 0x00 });
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.a, 0x83);
  });

  test('sets carry when result exceeds 0x99 after addition', () => {
    const registers = makeRegisters({ a: 0x9a, f: 0x00 });
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.f & 0x10, 0x10); // C set
  });

  test('sets zero flag when result is 0x00', () => {
    const registers = makeRegisters({ a: 0x00, f: 0x00 });
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.f & 0x80, 0x80); // Z set
  });

  test('corrects BCD after subtraction', () => {
    // 0x50 - 0x01 = 0x4F, N=1, H=1 → DAA subtracts 0x06 → 0x49
    const registers = makeRegisters({ a: 0x4f, f: 0x60 }); // N=1, H=1
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.a, 0x49);
  });

  test('clears H flag', () => {
    const registers = makeRegisters({ a: 0x0a, f: 0x20 }); // H=1
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.f & 0x20, 0x00); // H clear
  });

  test('preserves N flag', () => {
    const registers = makeRegisters({ a: 0x00, f: 0x40 }); // N=1
    const daa = createDaa({ registers });
    daa.execute();
    assert.strictEqual(registers.f & 0x40, 0x40); // N preserved
  });

  test('subtraction path without carry clears C', () => {
    const registers: Registers = { a: 0x4f, f: 0x60, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createDaa({ registers }).execute();
    assert.strictEqual(registers.a, 0x49);
    assert.strictEqual(registers.f & 0x10, 0x00);
  });

  test('subtraction path with carry', () => {
    const registers: Registers = { a: 0x85, f: 0x50, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createDaa({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
