import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { mmuFactory } from '../../../test-factories/mmu.js';
import { createRlA } from './rl-a.js';

suite('RL A', () => {
  test('rotates left through carry', () => {
    const registers: Registers = {
      a: 0, f: 0x10, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
      a: 0b10110100,
    };
    const mmu = mmuFactory.build();
    const op = createRlA({ registers });
    const cycles = op.execute();
    assert.strictEqual(registers.a, 0b01101001);
    assert.strictEqual(registers.f & 0x10, 0x10);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 8);
  });

  test('sets zero flag when result is 0', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const mmu = mmuFactory.build();
    const op = createRlA({ registers });
    op.execute();
    assert.strictEqual(registers.f & 0x80, 0x80);
  });
});
