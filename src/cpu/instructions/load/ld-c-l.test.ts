import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdCL } from './ld-c-l.js';

suite('LD C,L', () => {
  test('loads L into C', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0x42, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldCL = createLdCL({ registers });
    const cycles = ldCL.execute();
    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
