import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createPushHL } from './push-hl.js';

suite('PUSH HL', () => {
  test('pushes HL onto the stack', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const memory = new Uint8Array(0x10000);

    const pushHL = createPushHL({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = pushHL.execute();

    assert.strictEqual(memory[0xfffc], 0x34);
    assert.strictEqual(memory[0xfffd], 0x12);
    assert.strictEqual(registers.sp, 0xfffc);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 16);
  });
});