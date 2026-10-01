import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createPPU } from './ppu.js';
import { createInterruptController } from './interrupt-controller.js';

suite('PPU', () => {
  const makePPU = () => createPPU({ interruptController: createInterruptController() });

  test('can be created', () => {
    assert.ok(makePPU());
  });

  test('can be stepped by a number of cycles', () => {
    assert.doesNotThrow(() => makePPU().step(4));
  });

  test('LY increments after 456 dots', () => {
    const ppu = makePPU();
    for (let i = 0; i < 114; i++) ppu.step(4); // 114 * 4 = 456 dots
    assert.strictEqual(ppu.read8(0xff44), 1);
  });

  test('requests VBLANK interrupt at line 144', () => {
    const ic = createInterruptController();
    const ppu = createPPU({ interruptController: ic });
    for (let i = 0; i < 114 * 144; i++) ppu.step(4);
    assert.strictEqual(ic.read8(0xff0f) & 0x01, 1);
  });
});