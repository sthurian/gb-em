import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdLD } from './ld-l-d.js';

suite('LD L,D', () => {
  test('loads D into L', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0x42, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldLD = createLdLD({ registers });
    const cycles = ldLD.execute();
    assert.strictEqual(registers.l, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
