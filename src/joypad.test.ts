import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createJoypad } from './joypad.js';

suite('Joypad', () => {
  test('can be created', () => {
    const joypad = createJoypad({ interruptController: { read8: () => 0, write8: () => {}, request: () => {} } });

    assert.ok(joypad);
  });

  test('can press a button', () => {
    const joypad = createJoypad({ interruptController: { read8: () => 0, write8: () => {}, request: () => {} } });

    assert.doesNotThrow(() => joypad.press('A'));
  });

  test('can release a button', () => {
    const joypad = createJoypad({ interruptController: { read8: () => 0, write8: () => {}, request: () => {} } });

    assert.doesNotThrow(() => joypad.release('A'));
  });
});