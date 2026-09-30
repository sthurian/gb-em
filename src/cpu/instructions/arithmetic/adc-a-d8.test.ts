import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAdcAD8 } from './adc-a-d8.js';

suite('ADC A,d8', () => {
  test('adds d8 to A without carry', () => {
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

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x20);

    const adcAD8 = createAdcAD8({ mmu, registers });

    const cycles = adcAD8.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('adds d8 to A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
      f: 0x10, // carry set
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

    const mmu = mmuFactory.build();
    mmu.write8(0x0101, 0x20);

    const adcAD8 = createAdcAD8({ mmu, registers });

    const cycles = adcAD8.execute();

    assert.strictEqual(registers.a, 0x31);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0102);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const memory = new Uint8Array(0x10000); memory[0x0101] = 0x01;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAD8({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets half-carry flag', () => {
    const memory = new Uint8Array(0x10000); memory[0x0101] = 0x01;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAD8({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry flag on overflow', () => {
    const memory = new Uint8Array(0x10000); memory[0x0101] = 0x02;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false };
    createAdcAD8({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
