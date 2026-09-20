import { suite, test } from 'mocha';
import { createMMU } from './mmu.js';
import assert from 'node:assert';

suite('MMU', () => {
  test('returns zero for uninitialized memory', () => {
    const mmu = createMMU();
    assert.strictEqual(mmu.read8(0x0000), 0);
    assert.strictEqual(mmu.read8(0xffff), 0);
  });

  test('returns a previously written value', () => {
    const mmu = createMMU();
    mmu.write8(0x1234, 0x12);
    assert.strictEqual(mmu.read8(0x1234), 0x12);
  });

  test('rejects an address outside the 16-bit address space', () => {
    const mmu = createMMU();
    assert.throws(() => mmu.read8(0x10000), RangeError);
    assert.throws(() => mmu.write8(0x10000, 0x12), RangeError);
  });

  test('rejects a value outside the 8-bit range', () => {
    const mmu = createMMU();
    assert.throws(() => mmu.write8(0x1234, 0x100), RangeError);
  });
});
