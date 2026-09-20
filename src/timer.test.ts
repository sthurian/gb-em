import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createTimer } from './timer.js';

suite('Timer', () => {
  test('can be created', () => {
    const timer = createTimer();

    assert.ok(timer);
  });

  test('can be stepped by a number of cycles', () => {
    const timer = createTimer();

    assert.doesNotThrow(() => timer.step(4));
  });
});