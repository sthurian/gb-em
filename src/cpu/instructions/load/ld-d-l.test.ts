import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdDL } from './ld-d-l.js';

suite('LD D,L', () => {
  test('loads L into D', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0x42, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldDL = createLdDL({ registers });
    const cycles = ldDL.execute();
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
