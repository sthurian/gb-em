import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createAdcAH } from './adc-a-h.js';

suite('ADC A,H', () => {
  test('adds H to A without carry', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x20,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const adcAH = createAdcAH({ registers });
    const cycles = adcAH.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });

  test('adds H to A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x20,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    const adcAH = createAdcAH({ registers });
    const cycles = adcAH.execute();

    assert.strictEqual(registers.a, 0x31);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
