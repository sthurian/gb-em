import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import type { Registers } from '../../cpu.js';
import { createDecB } from './dec-b.js';

describe('DEC B', () => {
  it('decrements B and advances PC', () => {
    const registers: Registers = {
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
    };

    const instruction = createDecB({ registers });

    const cycles = instruction.execute();

    assert.equal(cycles, 4);
    assert.equal(registers.b, 0x41);
    assert.equal(registers.pc, 0x101);
  });
});