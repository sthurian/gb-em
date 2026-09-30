import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createReti } from './reti.js';

suite('RETI', () => {
  test('pops the return address from the stack, advances SP, sets ime to true, and returns 16 cycles', () => {
    const memory = new Uint8Array(0x10000);
    memory[0x8000] = 0x34;
    memory[0x8001] = 0x12;

    const mmu = mmuFactory.build({}, { transient: { memory } });

    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0x8000,
      pc: 0x0100,
      ime: false,
    };

    const reti = createReti({ mmu, registers });

    const cycles = reti.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(registers.sp, 0x8002);
    assert.strictEqual(registers.ime, true);
    assert.strictEqual(cycles, 16);
  });
});
