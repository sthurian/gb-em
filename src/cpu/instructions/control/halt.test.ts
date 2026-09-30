import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createHalt } from './halt.js';

suite('HALT', () => {
  test('sets halted and advances PC', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x0100,
      ime: false,
    };

    let halted = false;
    const halt = createHalt({ setHalted: () => { halted = true; }, registers });
    const cycles = halt.execute();

    assert.strictEqual(halted, true);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
