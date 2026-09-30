import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createSerial } from './serial.js';

suite('Serial', () => {
  test('emits the serial data when a transfer is started', () => {
    let output = 0;

    const serial = createSerial({
      output: { onByte: (value) => { output = value; } },
    });

    serial.write8(0xff01, 0x42);
    serial.write8(0xff02, 0x81);

    assert.strictEqual(output, 0x42);
  });

  test('read8 returns current data byte', () => {
    const serial = createSerial({ output: { onByte: () => {} } });
    serial.write8(0xff01, 0x42);
    assert.strictEqual(serial.read8(0xff01), 0x42);
  });

  test('write8 to 0xff02 without 0x81 does not emit', () => {
    let emitted = false;
    const serial = createSerial({ output: { onByte: () => { emitted = true; } } });
    serial.write8(0xff01, 0x42);
    serial.write8(0xff02, 0x00);
    assert.strictEqual(emitted, false);
  });
});
