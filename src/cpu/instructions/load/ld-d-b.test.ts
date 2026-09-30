import { suite, test } from 'mocha';
import assert from 'node:assert';
import type { Registers } from '../../cpu.js';
import { createLdDB } from './ld-d-b.js';

suite('LD D,B', () => {
  test('loads B into D', () => {
    const registers: Registers = {
      a: 0, f: 0, b: 0x42, c: 0, d: 0, e: 0, h: 0, l: 0, sp: 0, pc: 0x0100, ime: false, imeScheduled: false,
    };
    const ldDB = createLdDB({ registers });
    const cycles = ldDB.execute();
    assert.strictEqual(registers.d, 0x42);
    assert.strictEqual(registers.pc, 0x0101);
    assert.strictEqual(cycles, 4);
  });
});
