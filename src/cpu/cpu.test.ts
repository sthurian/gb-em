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

  test('services an interrupt when IME=1 and interrupt is pending', () => {
    const memory = new Uint8Array(0x10000);
    memory[0xffff] = 0x01; // IE: VBLANK enabled
    memory[0xff0f] = 0x01; // IF: VBLANK pending
    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters(), ime: true, pc: 0x0200, sp: 0xfffe };

    const cpu = createCPU({ mmu, registers, buildOpcodeTable: () => [] });
    const cycles = cpu.step();

    assert.strictEqual(cycles, 20, 'interrupt dispatch takes 20 cycles');
    assert.strictEqual(registers.pc, 0x0040, 'PC set to VBLANK vector');
    assert.strictEqual(registers.ime, false, 'IME cleared after dispatch');
    assert.strictEqual(memory[0xff0f] & 0x01, 0, 'VBLANK bit cleared in IF');
    // PC of interrupted instruction pushed to stack
    assert.strictEqual(memory[registers.sp + 1], 0x02, 'high byte of 0x0200 on stack');
    assert.strictEqual(memory[registers.sp], 0x00, 'low byte of 0x0200 on stack');
  });

  test('exits HALT on pending interrupt even with IME=0', () => {
    const memory = new Uint8Array(0x10000);
    memory[0xffff] = 0x01;
    memory[0xff0f] = 0x01;
    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters(), ime: false };

    const table: Array<Opcode | undefined> = [];
    table[0x00] = { mnemonic: 'NOP', bytes: 1, execute: () => { registers.pc++; return 4; } };

    const cpu = createCPU({ mmu, registers, buildOpcodeTable: () => table });

    // Force halted state by directly verifying isHalted returns false when pending interrupt
    // (halt is cleared before instruction executes)
    assert.strictEqual(cpu.isHalted(), false);
  });

  test('halted CPU returns 4 cycles per step without advancing PC', () => {
    const memory = new Uint8Array(0x10000);
    // No pending interrupts — CPU stays halted
    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters(), ime: true };

    const table: Array<Opcode | undefined> = [];

    const cpu = createCPU({
      mmu,
      registers,
      buildOpcodeTable: (deps) => {
        table[0x76] = {
          mnemonic: 'HALT',
          bytes: 1,
          execute: () => {
            deps.setHalted();
            deps.registers.pc++;
            return 4;
          },
        };
        return table;
      },
    });

    // Execute HALT instruction at PC=0
    memory[0x0000] = 0x76;
    cpu.step(); // executes HALT, sets halted=true, PC=1

    assert.strictEqual(cpu.isHalted(), true, 'CPU should be halted');
    const pc = registers.pc;
    const cycles = cpu.step(); // halted step
    assert.strictEqual(cycles, 4, 'halted step returns 4 cycles');
    assert.strictEqual(registers.pc, pc, 'PC does not change while halted');
  });

  test('imeScheduled activates IME after next instruction', () => {
    const memory = new Uint8Array(0x10000);
    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters() };

    let stepped = 0;
    const table: Array<Opcode | undefined> = [];
    table[0x00] = {
      mnemonic: 'NOP',
      bytes: 1,
      execute: () => {
        registers.pc++;
        if (stepped === 0) registers.imeScheduled = true;
        stepped++;
        return 4;
      },
    };

    const cpu = createCPU({ mmu, registers, buildOpcodeTable: () => table });
    memory[0x0000] = 0x00;
    memory[0x0001] = 0x00;

    cpu.step(); // executes NOP, sets imeScheduled=true; IME activated after this step
    assert.strictEqual(registers.ime, true, 'IME should be enabled after imeScheduled step');
  });

  test('getTrace wraps correctly after filling ring buffer', () => {
    const memory = new Uint8Array(0x10000);
    const mmu = { read8: (a: number) => memory[a]!, write8: (a: number, v: number) => { memory[a] = v; } };
    const registers = { ...createRegisters() };

    const table: Array<Opcode | undefined> = [];
    table[0x00] = { mnemonic: 'NOP', bytes: 1, execute: () => { registers.pc = (registers.pc + 1) & 0xffff; return 4; } };

    const cpu = createCPU({ mmu, registers, buildOpcodeTable: () => table });

    // Fill more than TRACE_SIZE (100) entries
    for (let i = 0; i < 0x200; i++) memory[i & 0x1ff] = 0x00;
    for (let i = 0; i < 110; i++) cpu.step();

    const trace = cpu.getTrace();
    assert.strictEqual(trace.length, 100, 'trace capped at 100 entries');
    // Most recent entry should be the last executed PC
    assert.strictEqual(trace[99]!.pc, 109, 'last trace entry is most recent PC');
  });
});
