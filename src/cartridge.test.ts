import { strict as assert } from 'node:assert';
import { suite, test } from 'mocha';
import { createCartridge } from './cartridge.js';

suite('Cartridge', () => {
  test('reads bytes from ROM', () => {
    const data = new Uint8Array([0x01, 0x02, 0x03]);

    const cartridge = createCartridge({ data });

    assert.equal(cartridge.read8(0), 0x01);
    assert.equal(cartridge.read8(1), 0x02);
    assert.equal(cartridge.read8(2), 0x03);
  });

  test('rejects invalid addresses', () => {
    const cartridge = createCartridge({
      data: new Uint8Array(0x8000),
    });

    assert.throws(() => cartridge.read8(-1), RangeError);
    assert.throws(() => cartridge.read8(0x8000), RangeError);
  });
});