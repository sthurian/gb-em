import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createCallCA16 } from './call-c-a16.js';

suite('CALL C,a16', () => {
  test('calls when C flag is set', () => {
    const registers: Registers = {
      a: 0,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);
    memory[0x0101] = 0x34;
    memory[0x0102] = 0x12;

    const mmu = mmuFactory.build({}, { transient: { memory } });

    const callC = createCallCA16({ mmu, registers });

    const cycles = callC.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(registers.sp, 0xfffc);
    assert.strictEqual(memory[0xfffc], 0x03);
    assert.strictEqual(memory[0xfffd], 0x01);
    assert.strictEqual(cycles, 24);
  });

  test('does not call when C flag is clear', () => {
    const registers: Registers = {
      a: 0,
      f: 0x00,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const mmu = mmuFactory.build();

    const callC = createCallCA16({ mmu, registers });

    const cycles = callC.execute();

    assert.strictEqual(registers.pc, 0x0103);
    assert.strictEqual(registers.sp, 0xfffe);
    assert.strictEqual(cycles, 12);
  });
});
