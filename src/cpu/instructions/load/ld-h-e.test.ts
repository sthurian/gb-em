import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdHE } from './ld-h-e.js';

suite('LD H,E', () => {
  test('loads E into H', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0, c: 0, d: 0, e: 0x42, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldHE = createLdHE({ registers });
    const cycles = ldHE.execute();
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
