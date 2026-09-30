import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAdcAL } from './adc-a-l.js';

suite('ADC A,L', () => {
  test('adds L to A without carry', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x20,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const adcAL = createAdcAL({ registers });
    const cycles = adcAL.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('adds L to A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x20,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const adcAL = createAdcAL({ registers });
    const cycles = adcAL.execute();

    assert.strictEqual(registers.a, 0x31);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, l: 0x01 };
    createAdcAL({ registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets half-carry flag', () => {
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, l: 0x01 };
    createAdcAL({ registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry flag on overflow', () => {
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, l: 0x02 };
    createAdcAL({ registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
