import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createJpHL } from './jp-hl.js';

suite('JP (HL)', () => {
  test('sets PC to the address in HL', () => {
    const registers: Registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0x12,
      l: 0x34,
      sp: 0,
      pc: 0x0100,
      ime: false,
      imeScheduled: false,
    };

    const jpHL = createJpHL({ registers });

    const cycles = jpHL.execute();

    assert.strictEqual(registers.pc, 0x1234);
    assert.strictEqual(cycles, 4);
  });
});
