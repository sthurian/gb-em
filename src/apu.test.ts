import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createAPU } from './apu.js';

suite('APU', () => {
  test('can be created', () => {
    const apu = createAPU();

    assert.ok(apu);
  });

  test('can be stepped by a number of cycles', () => {
    const apu = createAPU();

    assert.doesNotThrow(() => apu.step(4));
  });
});