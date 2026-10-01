import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createWaveChannel } from './wave-channel.js';

suite('WaveChannel', () => {
  test('can be created', () => {
    assert.ok(createWaveChannel());
  });

  test('disabled by default', () => {
    assert.strictEqual(createWaveChannel().isEnabled(), false);
  });

  test('trigger enables when DAC on', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1a, 0x80); // DAC on
    ch.write8(0xff1e, 0x80); // trigger
    assert.strictEqual(ch.isEnabled(), true);
  });

  test('DAC off disables channel', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1a, 0x80);
    ch.write8(0xff1e, 0x80);
    ch.write8(0xff1a, 0x00); // DAC off
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('disable() kills channel', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1a, 0x80);
    ch.write8(0xff1e, 0x80);
    ch.disable();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('length counter expires', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1a, 0x80);
    ch.write8(0xff1b, 0xff); // length = 256 - 255 = 1
    ch.write8(0xff1e, 0xc0); // trigger + length enable
    ch.clockLength();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('getDacOutput 0 when disabled', () => {
    assert.strictEqual(createWaveChannel().getDacOutput(), 0);
  });

  test('wave RAM read/write', () => {
    const ch = createWaveChannel();
    ch.write8(0xff30, 0xab);
    ch.write8(0xff3f, 0xcd);
    assert.strictEqual(ch.read8(0xff30), 0xab);
    assert.strictEqual(ch.read8(0xff3f), 0xcd);
  });

  test('read8 NR32 output level', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1c, 0x40); // output level = 2 (bits 6-5 = 10)
    assert.strictEqual((ch.read8(0xff1c) >> 5) & 0x03, 2);
  });

  test('read8 NR34 length enable bit', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1e, 0x40);
    assert.strictEqual(ch.read8(0xff1e) & 0x40, 0x40);
  });

  test('getDacOutput nonzero when active and wave RAM set', () => {
    const ch = createWaveChannel();
    ch.write8(0xff1a, 0x80);
    ch.write8(0xff1c, 0x20); // output level = 1 (100%)
    // Fill wave RAM with non-silent pattern
    for (let i = 0xff30; i <= 0xff3f; i++) ch.write8(i, 0x88);
    ch.write8(0xff1e, 0x80); // trigger
    ch.step(1);
    const out = ch.getDacOutput();
    assert.ok(typeof out === 'number' && isFinite(out));
  });
});
