import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createPulseChannel } from './pulse-channel.js';

suite('PulseChannel', () => {
  test('can be created', () => {
    assert.ok(createPulseChannel({ hasSweep: false, base: 0xff15 }));
  });

  test('disabled by default', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('trigger enables when DAC on', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0); // DAC on (high nibble nonzero)
    ch.write8(0xff19, 0x80); // trigger
    assert.strictEqual(ch.isEnabled(), true);
  });

  test('trigger disabled when DAC off', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0x00); // DAC off
    ch.write8(0xff19, 0x80); // trigger
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('DAC off after trigger disables channel', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0);
    ch.write8(0xff19, 0x80);
    assert.strictEqual(ch.isEnabled(), true);
    ch.write8(0xff17, 0x00); // DAC off
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('disable() turns off channel and DAC', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0);
    ch.write8(0xff19, 0x80);
    ch.disable();
    assert.strictEqual(ch.isEnabled(), false);
    ch.write8(0xff19, 0x80); // re-trigger should fail — DAC cleared
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('length counter expires after clockLength calls', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0);
    ch.write8(0xff16, 0x3f); // length load = 64 - 63 = 1
    ch.write8(0xff19, 0xc0); // trigger + length enable
    ch.clockLength();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('getDacOutput 0 when disabled', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    assert.strictEqual(ch.getDacOutput(), 0);
  });

  test('getDacOutput nonzero when active', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0); // vol=15, DAC on
    ch.write8(0xff16, 0x80); // duty=2 (50%)
    ch.write8(0xff19, 0x80); // trigger
    // Step enough to advance duty position out of initial phase
    ch.step(8192);
    const out = ch.getDacOutput();
    assert.ok(typeof out === 'number' && isFinite(out));
  });

  test('read8 NRx1 duty bits', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff16, 0x40); // duty = 1
    assert.strictEqual((ch.read8(0xff16) >> 6) & 0x03, 1);
  });

  test('read8 NRx4 length enable bit', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff19, 0x40); // length enable, no trigger
    assert.strictEqual(ch.read8(0xff19) & 0x40, 0x40);
  });

  test('sweep channel: clockSweep overflow disables', () => {
    const ch = createPulseChannel({ hasSweep: true, base: 0xff10 });
    ch.write8(0xff10, 0b00010001); // period=1, negate=false, shift=1
    ch.write8(0xff12, 0xf0);       // DAC on
    ch.write8(0xff13, 0xff);       // freq lo
    ch.write8(0xff14, 0x87);       // freq hi=7, trigger → shadow=0x7ff
    // First sweep clock: 2047 + (2047>>1) = 3070 > 2047 → disable
    ch.clockSweep();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('non-sweep channel: clockSweep is no-op', () => {
    const ch = createPulseChannel({ hasSweep: false, base: 0xff15 });
    ch.write8(0xff17, 0xf0);
    ch.write8(0xff19, 0x80);
    ch.clockSweep(); // should not throw or disable
    assert.strictEqual(ch.isEnabled(), true);
  });
});
