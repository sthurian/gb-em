import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createInterruptController } from './interrupt-controller.js';
import { createTimer } from './timer.js';

suite('Timer', () => {
  const makeTimer = () => createTimer({ interruptController: createInterruptController() });

  test('can be created', () => {
    assert.ok(makeTimer());
  });

  test('can be stepped by a number of cycles', () => {
    assert.doesNotThrow(() => makeTimer().step(4));
  });

  test('DIV increments with cycles', () => {
    const timer = makeTimer();
    timer.step(256);
    assert.strictEqual(timer.read8(0xff04), 1);
  });

  test('DIV resets to 0 on write', () => {
    const timer = makeTimer();
    timer.step(256);
    timer.write8(0xff04, 0x42);
    assert.strictEqual(timer.read8(0xff04), 0);
  });

  test('TIMA increments when timer enabled', () => {
    const timer = makeTimer();
    timer.write8(0xff07, 0x04); // enable, 4096 Hz (1024 cycles)
    timer.step(1024);
    assert.strictEqual(timer.read8(0xff05), 1);
  });

  test('requests TIMER interrupt on TIMA overflow', () => {
    const interruptController = createInterruptController();
    const timer = createTimer({ interruptController });
    timer.write8(0xff05, 0xff); // TIMA near overflow
    timer.write8(0xff06, 0x00); // TMA = 0
    timer.write8(0xff07, 0x05); // enable, 64 cycles
    timer.step(64);
    // interrupt pending — fires on next step (1-cycle delay)
    assert.strictEqual(interruptController.read8(0xff0f) & 0x04, 0x00);
    timer.step(4);
    assert.strictEqual(interruptController.read8(0xff0f) & 0x04, 0x04);
  });
});