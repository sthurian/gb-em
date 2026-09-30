import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createSubHLIndirect } from './sub-hl-indirect.js';

suite('SUB (HL)', () => {
  test('subtracts value at (HL) from A', () => {
    const registers: Registers = {
      a: 0x20,
      f: 0xff,
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
    mmu.write8(0xc000, 0x05);

    const subHLIndirect = createSubHLIndirect({ mmu, registers });

    const cycles = subHLIndirect.execute();

    assert.strictEqual(registers.a, 0x1b);
    assert.strictEqual(registers.f, 0x60);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero and N flags when result is zero', () => {
    const registers: Registers = {
      a: 0x42,
      f: 0,
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
    mmu.write8(0xc000, 0x42);

    const subHLIndirect = createSubHLIndirect({ mmu, registers });

    subHLIndirect.execute();

    assert.strictEqual(registers.a, 0x00);
    assert.strictEqual(registers.f, 0xc0);
  });

  test('sets carry when value > A', () => {
    const memory = new Uint8Array(0x10000); memory[0x0000] = 0x10;
    const mmu = mmuFactory.build({}, { transient: { memory } });
    const registers: Registers = { a: 0x01, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false };
    createSubHLIndirect({ mmu, registers }).execute();
    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});
