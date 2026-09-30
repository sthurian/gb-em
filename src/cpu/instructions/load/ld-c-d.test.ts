import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdCD } from './ld-c-d.js';

suite('LD C,D', () => {
  test('loads D into C', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0x42, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldCD = createLdCD({ registers });
    const cycles = ldCD.execute();
    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
