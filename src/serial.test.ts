import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createSerial } from './serial.js';

suite('Serial', () => {
  test('emits the serial data when a transfer is started', () => {
    let output = 0;

    const serial = createSerial({
      onByte: (value) => {
        output = value;
      },
    });

    serial.write8(0xff01, 0x42);
    serial.write8(0xff02, 0x81);

    assert.strictEqual(output, 0x42);
  });
});