import { suite, test } from 'mocha';
import assert from 'node:assert';
import { decrement8 } from './decrement8.js';

suite('decrement8', () => {
  test('decrements a value', () => {
    assert.deepStrictEqual(decrement8(0x42), {
      value: 0x41,
      zero: false,
      halfBorrow: false,
    });
  });

  test('sets half-borrow when the lower nibble underflows', () => {
    assert.deepStrictEqual(decrement8(0x10), {
      value: 0x0f,
      zero: false,
      halfBorrow: true,
    });
  });

  test('wraps around at 0x00', () => {
    assert.deepStrictEqual(decrement8(0x00), {
      value: 0xff,
      zero: false,
      halfBorrow: true,
    });
  });
});
