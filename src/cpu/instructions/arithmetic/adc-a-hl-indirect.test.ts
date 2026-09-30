import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createAdcAHLIndirect } from './adc-a-hl-indirect.js';

suite('ADC A,(HL)', () => {
  test('adds value at (HL) to A without carry', () => {
    const registers: Registers = {
      a: 0x10,
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
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x20);

    const adcAHLIndirect = createAdcAHLIndirect({ mmu, registers });
    const cycles = adcAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x30);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('adds value at (HL) to A with carry in', () => {
    const registers: Registers = {
      a: 0x10,
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
    };

    const mmu = mmuFactory.build();
    mmu.write8(0xc000, 0x20);

    const adcAHLIndirect = createAdcAHLIndirect({ mmu, registers });
    const cycles = adcAHLIndirect.execute();

    assert.strictEqual(registers.a, 0x31);
    assert.strictEqual(registers.f, 0x00);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x01;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createAdcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('sets half-carry flag', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x01;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x0f, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createAdcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('sets carry flag on overflow', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x02;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0xff, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createAdcAHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
