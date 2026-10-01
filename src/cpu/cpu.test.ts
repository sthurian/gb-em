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

  test('HALT bug: IME=0 with pending interrupt skips halt and re-reads next opcode as first operand', () => {
    const memory = new Uint8Array(0x10000);
    // IE = 0x01 (VBLANK enabled), IF = 0x01 (VBLANK pending)
    memory[0xffff] = 0x01;
    memory[0xff0f] = 0x01;
    // PC=0: HALT (0x76), PC=1: LD B,d8 (0x06), PC=2: 0x42
    memory[0x0000] = 0x76;
    memory[0x0001] = 0x06;
    memory[0x0002] = 0x42;

    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters(), ime: false };

    const cpu = createCPU({
      mmu,
      registers,
      buildOpcodeTable: (deps) => {
        const table: Array<Opcode | undefined> = [];
        // LD B, d8 — reads next byte as operand
        table[0x06] = {
          mnemonic: 'LD B,d8',
          bytes: 2,
          execute: () => {
            deps.registers.b = deps.mmu.read8(deps.registers.pc + 1);
            deps.registers.pc = (deps.registers.pc + 2) & 0xffff;
            return 8;
          },
        };
        // HALT
        table[0x76] = {
          mnemonic: 'HALT',
          bytes: 1,
          execute: () => {
            deps.setHalted();
            deps.registers.pc = (deps.registers.pc + 1) & 0xffff;
            return 4;
          },
        };
        return table;
      },
    });

    // Step 1: HALT with bug — should not halt, PC advances to 1
    cpu.step();
    assert.strictEqual(registers.pc, 0x0001, 'PC should advance past HALT');

    // Step 2: LD B,d8 executes with PC=1 but reads operand from PC+1=2 after PC was decremented
    // Due to halt bug: before execute, PC is decremented by 1 → PC=0
    // execute() reads operand at PC+1=1 (the 0x06 opcode byte), sets B=0x06, advances PC to 2
    cpu.step();
    assert.strictEqual(registers.b, 0x06, 'halt bug: operand byte should be the opcode byte (0x06), not 0x42');
    assert.strictEqual(registers.pc, 0x0002, 'PC ends at 2 after halt-bugged LD B,d8');
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
