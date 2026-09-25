import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createCartridge } from './cartridge.js';
import { createMMU } from './mmu.js';
import type { MMU } from './mmu.js';

suite('MMU', () => {
  const createTestMMU = (): MMU => {
    const cartridge = createCartridge({
      data: new Uint8Array(0x8000),
    });

    return createMMU({ cartridge });
  };

  test('returns zero for uninitialized memory', () => {
    const mmu = createTestMMU();
    assert.strictEqual(mmu.read8(0x0000), 0);
    assert.strictEqual(mmu.read8(0xffff), 0);
  });

  test('returns a previously written value from writable memory', () => {
    const mmu = createTestMMU();
    mmu.write8(0x8000, 0x12);
    assert.strictEqual(mmu.read8(0x8000), 0x12);
  });

  test('does not modify cartridge ROM when writing to ROM', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x1234] = 0x42;

    const cartridge = createCartridge({ data: cartridgeData });
    const mmu = createMMU({ cartridge });

    mmu.write8(0x1234, 0xab);

    assert.strictEqual(mmu.read8(0x1234), 0x42);
  });

  test('rejects an address outside the 16-bit address space', () => {
    const mmu = createTestMMU();
    assert.throws(() => mmu.read8(0x10000), RangeError);
    assert.throws(() => mmu.write8(0x10000, 0x12), RangeError);
  });

  test('rejects a value outside the 8-bit range', () => {
    const mmu = createTestMMU();
    assert.throws(() => mmu.write8(0x1234, 0x100), RangeError);
  });

  test('reads cartridge ROM from 0x0000 to 0x7fff', () => {
    const cartridgeData = new Uint8Array(0x8000);
    cartridgeData[0x0000] = 0x42;
    cartridgeData[0x1234] = 0xab;
    cartridgeData[0x7fff] = 0xcd;

    const cartridge = createCartridge({ data: cartridgeData });
    const mmu = createMMU({ cartridge });

    assert.equal(mmu.read8(0x0000), 0x42);
    assert.equal(mmu.read8(0x1234), 0xab);
    assert.equal(mmu.read8(0x7fff), 0xcd);
  });
});