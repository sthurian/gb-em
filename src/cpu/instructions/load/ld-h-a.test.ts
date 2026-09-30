import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdHA } from './ld-h-a.js';

suite('LD H,A', () => {
  test('loads A into H', () => {
    const registers: Registers = {
      a: 0x42, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false,
    };
    const ldHA = createLdHA({ registers });
    const cycles = ldHA.execute();
    assert.strictEqual(registers.h, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
