import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import type { Registers } from '../../cpu.js';
import { createDecC } from './dec-c.js';

describe('DEC C', () => {
  it('decrements C and advances PC', () => {
    const registers: Registers = {
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
    };

    const instruction = createDecC({ registers });

    const cycles = instruction.execute();

    assert.equal(cycles, 4);
    assert.equal(registers.c, 0x41);
    assert.equal(registers.pc, 0x101);
  });
});