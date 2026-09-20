import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import type { Registers } from '../../cpu.js';
import { createDecE } from './dec-e.js';

describe('DEC E', () => {
  it('decrements E and advances PC', () => {
    const registers: Registers = {
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
    };

    const instruction = createDecE({ registers });

    const cycles = instruction.execute();

    assert.equal(cycles, 4);
    assert.equal(registers.e, 0x41);
    assert.equal(registers.pc, 0x101);
  });
});