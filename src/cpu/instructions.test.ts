import { suite, test } from 'mocha';
import { createMMU } from '../mmu.js';
import assert from 'node:assert';
import { createCPU } from './cpu.js';

suite('Instructions', () => {
  test('loads an immediate value into B', () => {
    const mmu = createMMU();
    const cpu = createCPU({ mmu });

    mmu.write8(0x0000, 0x06);
    mmu.write8(0x0001, 0x42);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 8);
    assert.deepStrictEqual(cpu.getState(), {
      registers: {
        a: 0,
        f: 0,
        b: 0x42,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x0002,
      },
    });
  });

  test('executes INC B', () => {
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
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x04);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState(), {
      registers: {
        a: 0,
        f: 0,
        b: 0x42,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x101,
      },
    });
  });

  test('executes INC C', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0x41,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x0c);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0,
      b: 0,
      c: 0x42,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('INC preserves the carry flag', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0x10,
        b: 0x41,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x04);

    cpu.step();

    assert.strictEqual(cpu.getState().registers.f, 0x10);
  });

  test('executes INC D', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0x41,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x14);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0x42,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes INC E', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0x41,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x1c);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0x42,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes INC H', () => {
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
        h: 0x41,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x24);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x42,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes INC L', () => {
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
        l: 0x41,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x2c);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0x42,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes INC A', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0x41,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x3c);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0x42,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes INC (HL)', () => {
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
        h: 0x12,
        l: 0x34,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x34);
    mmu.write8(0x1234, 0x41);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 12);
    assert.strictEqual(mmu.read8(0x1234), 0x42);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });
  test('executes DEC B', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0x42,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x05);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.deepStrictEqual(cpu.getState().registers, {
      a: 0,
      f: 0x40,
      b: 0x41,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x101,
    });
  });

  test('executes DEC C', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0x42,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x0d);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.c, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC D', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0x42,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x15);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.d, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC E', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0x42,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x1d);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.e, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC H', () => {
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
        h: 0x42,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x25);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.h, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC L', () => {
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
        l: 0x42,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x2d);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.l, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC (HL)', () => {
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
        h: 0x12,
        l: 0x34,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x35);
    mmu.write8(0x1234, 0x42);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 12);
    assert.strictEqual(mmu.read8(0x1234), 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('executes DEC A', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0x42,
        f: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x3d);

    const cycles = cpu.step();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(cpu.getState().registers.a, 0x41);
    assert.strictEqual(cpu.getState().registers.pc, 0x101);
  });

  test('DEC sets the N flag and preserves the carry flag', () => {
    const mmu = createMMU();
    const cpu = createCPU({
      mmu,
      registers: {
        a: 0,
        f: 0x10,
        b: 0x42,
        c: 0,
        d: 0,
        e: 0,
        h: 0,
        l: 0,
        sp: 0,
        pc: 0x100,
      },
    });

    mmu.write8(0x100, 0x05);

    cpu.step();

    assert.strictEqual(cpu.getState().registers.f, 0x50);
  });
});
