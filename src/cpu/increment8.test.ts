import { suite, test } from 'mocha';
import assert from 'node:assert';
import { increment8 } from './increment8.js';

suite('increment8', () => {
  test('increments a value', () => {
    assert.deepStrictEqual(increment8(0x41), {
      value: 0x42,
      zero: false,
      halfCarry: false,
    });
  });
  test('sets half-carry when the lower nibble overflows', () => {
    assert.deepStrictEqual(increment8(0x0f), {
      value: 0x10,
      zero: false,
      halfCarry: true,
    });
  });
  test('wraps around at 0xff', () => {
    assert.deepStrictEqual(increment8(0xff), {
      value: 0x00,
      zero: true,
      halfCarry: true,
    });
  });
});
