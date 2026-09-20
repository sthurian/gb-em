import { suite, test } from 'mocha';
import { createMMU } from '../mmu.js';
import assert from 'node:assert';
import { createCPU } from './cpu.js';

suite('CPU', () => {
  test('rejects an unsupported opcode', () => {
    const mmu = createMMU();
    const cpu = createCPU({ mmu });
    mmu.write8(0x0000, 0xff);
    assert.throws(() => cpu.step(), Error);
  });

  test('does not advance PC for an unsupported opcode', () => {
    const mmu = createMMU();
    const cpu = createCPU({ mmu });
    mmu.write8(0x0000, 0xff);
    assert.throws(() => cpu.step(), Error);
    assert.strictEqual(cpu.getState().registers.pc, 0);
  });

  test('executes NOP', () => {
    const mmu = createMMU();
    const cpu = createCPU({ mmu });
    mmu.write8(0x0000, 0x00);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState(), {
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 1,
      },
    });
  });

  test('wraps PC when executing NOP at the end of the address space', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0xffff,
      },
    });

    mmu.write8(0xffff, 0x00);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.pc, 0x0000);
  });

  test('wraps PC when executing LD B,d8 at the end of the address space', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0xfffe,
      },
    });

    mmu.write8(0xfffe, 0x06);
    mmu.write8(0xffff, 0x42);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 8);
    assert.strictEqual(cpu.getState().registers.b, 0x42);
    assert.strictEqual(cpu.getState().registers.pc, 0x0000);
  });

  test('wraps PC when executing INC B at the end of the address space', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0x41,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0xffff,
      },
    });

    mmu.write8(0xffff, 0x04);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.b, 0x42);
    assert.strictEqual(cpu.getState().registers.pc, 0x0000);
  });
});
