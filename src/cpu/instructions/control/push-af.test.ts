import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createPushAF } from './push-af.js';

suite('PUSH AF', () => {
  test('pushes AF onto the stack', () => {
    const registers: Registers = {
      a: 0x12,
      f: 0xb7,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0xfffe,
      pc: 0x0100,
      ime: false,
    };

    const memory = new Uint8Array(0x10000);

    const pushAF = createPushAF({
      mmu: {
        read8: (address) => memory[address]!,
        write8: (address, value) => {
          memory[address] = value;
        },
      },
      registers,
    });

    const cycles = pushAF.execute();

    assert.strictEqual(memory[0xfffc], 0xb0);
    assert.strictEqual(memory[0xfffd], 0x12);
    assert.strictEqual(registers.sp, 0xfffc);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 16);
  });
});