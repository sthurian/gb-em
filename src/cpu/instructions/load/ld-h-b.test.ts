import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdHB } from './ld-h-b.js';

suite('LD H,B', () => {
  test('loads B into H', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0x42, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldHB = createLdHB({ registers });
    const cycles = ldHB.execute();
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
