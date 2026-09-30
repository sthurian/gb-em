import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdED } from './ld-e-d.js';

suite('LD E,D', () => {
  test('loads D into E', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0x42, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldED = createLdED({ registers });
    const cycles = ldED.execute();
    assert.strictEqual(registers.e, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
