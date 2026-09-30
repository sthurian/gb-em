import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdHL } from './ld-h-l.js';

suite('LD H,L', () => {
  test('loads L into H', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0x42, sp: 0, pc: 0x0100, ime: false,
    };
    const ldHL = createLdHL({ registers });
    const cycles = ldHL.execute();
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
