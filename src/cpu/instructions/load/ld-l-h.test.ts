import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdLH } from './ld-l-h.js';

suite('LD L,H', () => {
  test('loads H into L', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0x42, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldLH = createLdLH({ registers });
    const cycles = ldLH.execute();
    assert.strictEqual(registers.l, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
