import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createInc8 } from './create-inc8.js';

suite('createInc8', () => {
  test('increments the value', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    const cycles = inc8.execute();

    assert.strictEqual(cycles, 4);
    assert.strictEqual(value, 0x42);
    assert.strictEqual(registers.pc, 0x101);
  });

  test('wraps the value from 0xff to 0x00', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0xff;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(value, 0x00);
  });

  test('wraps the program counter at 0xffff', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0xffff,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.pc, 0x0000);
  });
    test('sets the zero flag when the result is zero', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0xff;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x80, 0x80);
  });

  test('clears the zero flag when the result is not zero', () => {
    const registers = {
      a: 0,
      f: 0x80,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x80, 0);
  });

  test('sets the half-carry flag when the lower nibble overflows', () => {
    const registers = {
      a: 0,
      f: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x0f;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x20, 0x20);
  });

  test('clears the half-carry flag when there is no half-carry', () => {
    const registers = {
      a: 0,
      f: 0x20,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x20, 0);
  });

  test('clears the subtract flag', () => {
    const registers = {
      a: 0,
      f: 0x40,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x40, 0);
  });

  test('preserves the carry flag', () => {
    const registers = {
      a: 0,
      f: 0x10,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      h: 0,
      l: 0,
      sp: 0,
      pc: 0x100,
    };

    let value = 0x41;

    const inc8 = createInc8({
      registers,
      getValue: () => value,
      setValue: (newValue) => {
        value = newValue;
      },
    });

    inc8.execute();

    assert.strictEqual(registers.f & 0x10, 0x10);
  });
});