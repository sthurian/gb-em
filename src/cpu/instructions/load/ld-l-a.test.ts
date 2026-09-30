import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdLA } from './ld-l-a.js';

suite('LD L,A', () => {
  test('loads A into L', () => {
    const registers: Registers = {
      a: 0x42, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldLA = createLdLA({ registers });
    const cycles = ldLA.execute();
    assert.strictEqual(registers.l, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
