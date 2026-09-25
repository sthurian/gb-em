import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import { createMMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';
import { createDecHL } from './dec-hl.js';
import { mmuFactory } from '../../../test-factories/mmu.js';

const createRegisters = (): Registers => ({
  a: 0,
  f: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  h: 0x12,
  l: 0x34,
  sp: 0,
  pc: 0x100,
});

describe('DEC (HL)', () => {
  it('decrements the value at the address in HL', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    const cycles = instruction.execute();

    assert.equal(cycles, 12);
    assert.equal(mmu.read8(0x1234), 0x41);
  });

  it('wraps from 0x00 to 0xff', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x00);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(mmu.read8(0x1234), 0xff);
  });

  it('sets Z when the result is zero', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x01);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x80, 0x80);
  });

  it('clears Z when the result is nonzero', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();
    registers.f = 0x80;

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x80, 0);
  });

  it('sets N', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x40, 0x40);
  });

  it('sets H when there is a half-borrow', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x10);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x20, 0x20);
  });

  it('clears H when there is no half-borrow', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();
    registers.f = 0x20;

    mmu.write8(0x1234, 0x11);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x20, 0);
  });

  it('preserves C', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();
    registers.f = 0x10;

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.f & 0x10, 0x10);
  });

  it('advances PC', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.pc, 0x101);
  });

  it('wraps PC from 0xffff to 0', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();
    registers.pc = 0xffff;

    mmu.write8(0x1234, 0x42);

    const instruction = createDecHL({ mmu, registers });

    instruction.execute();

    assert.equal(registers.pc, 0);
  });
});