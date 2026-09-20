import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import type { Registers } from '../../cpu.js';
import { createDec8 } from './create-dec8.js';

describe('createDec8', () => {
  const createRegisters = (): Registers => ({
    a: 0,
    f: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    h: 0,
    l: 0,
    sp: 0,
    pc: 0x100,
  });

  it('decrements the value', () => {
    const registers = createRegisters();
    let value = 0x42;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    const cycles = instruction.execute();

    assert.equal(cycles, 4);
    assert.equal(value, 0x41);
  });

  it('wraps from 0x00 to 0xff', () => {
    const registers = createRegisters();
    let value = 0x00;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(value, 0xff);
  });

  it('sets Z when the result is zero', () => {
    const registers = createRegisters();
    let value = 0x01;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x80, 0x80);
  });

  it('clears Z when the result is nonzero', () => {
    const registers = createRegisters();
    registers.f = 0x80;
    let value = 0x42;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x80, 0);
  });

  it('sets N', () => {
    const registers = createRegisters();
    let value = 0x42;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x40, 0x40);
  });

  it('sets H when there is a half-borrow', () => {
    const registers = createRegisters();
    let value = 0x10;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x20, 0x20);
  });

  it('clears H when there is no half-borrow', () => {
    const registers = createRegisters();
    registers.f = 0x20;
    let value = 0x11;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x20, 0);
  });

  it('preserves C', () => {
    const registers = createRegisters();
    registers.f = 0x10;
    let value = 0x42;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.f & 0x10, 0x10);
  });

  it('wraps PC from 0xffff to 0', () => {
    const registers = createRegisters();
    registers.pc = 0xffff;
    let value = 0x42;

    const instruction = createDec8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    instruction.execute();

    assert.equal(registers.pc, 0);
  });
});