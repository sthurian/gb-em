import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCPU } from './cpu.js';
import type { Opcode } from './opcode-table.js';
import { mmuFactory } from '../test-factories/mmu.js';

const createRegisters = () => ({
  a: 0,
  f: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  h: 0,
  l: 0,
  sp: 0,
  pc: 0,
  ime: false,
  imeScheduled: false,
});

suite('CPU', () => {
  test('rejects an unsupported opcode', () => {
    const mmu = mmuFactory.build();

    const cpu = createCPU({
      mmu,
      registers: createRegisters(),
      buildOpcodeTable: () => [],
    });

    mmu.write8(0x0000, 0xff);

    assert.throws(
      () => cpu.step(),
      /Unsupported opcode: 0xff/,
    );
  });

  test('does not advance PC for an unsupported opcode', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    const cpu = createCPU({
      mmu,
      registers,
      buildOpcodeTable: () => [],
    });

    mmu.write8(0x0000, 0xff);

    assert.throws(() => cpu.step(), Error);
    assert.strictEqual(registers.pc, 0);
  });

  test('executes the instruction for the current opcode', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();
    const fakeTable: Array<Opcode | undefined> = [];

    fakeTable[0x42] = {
      mnemonic: 'TEST',
      bytes: 1,
      execute: () => 7,
    };

    const cpu = createCPU({
      mmu,
      registers,
      buildOpcodeTable: () => fakeTable,
    });

    mmu.write8(0x0000, 0x42);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 7);
  });

  test('returns a copy of the CPU state', () => {
    const mmu = mmuFactory.build();
    const registers = createRegisters();

    const cpu = createCPU({
      mmu,
      registers,
      buildOpcodeTable: () => [],
    });

    const state = cpu.getState();

    state.registers.b = 0x42;

    assert.strictEqual(registers.b, 0);
  });
});
