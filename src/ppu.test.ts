import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createPPU } from './ppu.js';

suite('PPU', () => {
  test('can be created', () => {
    const ppu = createPPU();

    assert.ok(ppu);
  });

  test('can be stepped by a number of cycles', () => {
    const ppu = createPPU();

    assert.doesNotThrow(() => ppu.step(4));
  });
});