import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdCE } from './ld-c-e.js';

suite('LD C,E', () => {
  test('loads E into C', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0x42, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldCE = createLdCE({ registers });
    const cycles = ldCE.execute();
    assert.strictEqual(registers.c, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
