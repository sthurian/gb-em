import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRetNz } from './ret-nz.js';

suite('RET NZ', () => {
  test('pops the return address from the stack when Z flag is clear', () => {
    const memory = new Uint8Array(0x10000);
    memory[0x8000] = 0x34;
    memory[0x8001] = 0x12;

    const mmu = mmuFactory.build({}, { transient: { memory } });

    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x8000,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const retNz = createRetNz({ mmu, registers });

    const cycles = retNz.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(registers.sp, 0x8002);
    assert.strictEqual(cycles, 20);
  });

  test('advances PC by 1 and returns 8 cycles when Z flag is set', () => {
    const mmu = mmuFactory.build();

    const registers: Registers = {
      a: 0,
      f: 0x80,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x8000,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const retNz = createRetNz({ mmu, registers });

    const cycles = retNz.execute();

    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(registers.sp, 0x8000);
    assert.strictEqual(cycles, 8);
  });
});
