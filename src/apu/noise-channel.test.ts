import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createNoiseChannel } from './noise-channel.js';

suite('NoiseChannel', () => {
  test('can be created', () => {
    assert.ok(createNoiseChannel());
  });

  test('disabled by default', () => {
    assert.strictEqual(createNoiseChannel().isEnabled(), false);
  });

  test('trigger enables when DAC on', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0xf0); // DAC on (high nibble nonzero)
    ch.write8(0xff23, 0x80); // trigger
    assert.strictEqual(ch.isEnabled(), true);
  });

  test('trigger disabled when DAC off', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0x00);
    ch.write8(0xff23, 0x80);
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('DAC off disables channel', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0xf0);
    ch.write8(0xff23, 0x80);
    ch.write8(0xff21, 0x00);
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('disable() kills channel', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0xf0);
    ch.write8(0xff23, 0x80);
    ch.disable();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('length counter expires', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0xf0);
    ch.write8(0xff20, 0x3f); // length = 64 - 63 = 1
    ch.write8(0xff23, 0xc0); // trigger + length enable
    ch.clockLength();
    assert.strictEqual(ch.isEnabled(), false);
  });

  test('getDacOutput 0 when disabled', () => {
    assert.strictEqual(createNoiseChannel().getDacOutput(), 0);
  });

  test('getDacOutput finite when active', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0xf0); // vol=15, DAC on
    ch.write8(0xff23, 0x80); // trigger
    ch.step(4);
    const out = ch.getDacOutput();
    assert.ok(typeof out === 'number' && isFinite(out));
  });

  test('read8 NR42 envelope register', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff21, 0x85); // vol=8, add=false, period=5 → 0x85? no: 0b10000101 = vol=8,add=false,period=5
    assert.strictEqual(ch.read8(0xff21), 0x85);
  });

  test('read8 NR43 freq/width register', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff22, 0x37); // clkShift=3, width7=false, divCode=7
    assert.strictEqual(ch.read8(0xff22), 0x37);
  });

  test('read8 NR44 length enable bit', () => {
    const ch = createNoiseChannel();
    ch.write8(0xff23, 0x40);
    assert.strictEqual(ch.read8(0xff23) & 0x40, 0x40);
  });
});
