import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createInterruptController } from './interrupt-controller.js';

suite('Interrupt Controller', () => {
  test('can be created', () => {
    const interruptController = createInterruptController();

    assert.ok(interruptController);
  });

  test('can request an interrupt', () => {
    const interruptController = createInterruptController();

    assert.doesNotThrow(() => {
      interruptController.request('VBLANK');
    });
  });
});