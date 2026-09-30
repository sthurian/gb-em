import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdDC } from './ld-d-c.js';

suite('LD D,C', () => {
  test('loads C into D', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0x42, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldDC = createLdDC({ registers });
    const cycles = ldDC.execute();
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
