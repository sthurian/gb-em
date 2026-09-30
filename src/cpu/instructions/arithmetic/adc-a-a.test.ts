import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAdcAA } from './adc-a-a.js';

suite('ADC A,A', () => {
  test('adds A to A without carry', () => {
    const registers: Registers = {
      a: 0x10,
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
      imeScheduled: false,
    };

    const adcAA = createAdcAA({ registers });
    const cycles = adcAA.execute();

    assert.strictEqual(registers.a, 0x20);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('adds A to A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
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
      imeScheduled: false,
    };

    const adcAA = createAdcAA({ registers });
    const cycles = adcAA.execute();

    // 0x10 + 0x10 + 1 = 0x21
    assert.strictEqual(registers.a, 0x21);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = { a: 0x00, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets half-carry flag', () => {
    const registers: Registers = { a: 0x08, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry flag on overflow', () => {
    const registers: Registers = { a: 0x80, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAA({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
