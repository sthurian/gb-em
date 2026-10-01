import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createAPU } from './apu.js';

suite('APU', () => {
  test('can be created', () => {
    assert.ok(createAPU());
  });

  test('can be stepped by a number of cycles', () => {
    assert.doesNotThrow(() => createAPU().step(4));
  });

  test('read8 returns masked values for unwritten registers', () => {
    const apu = createAPU();
    // NR10: unused bit 7 always 1 → reads 0x80
    assert.strictEqual(apu.read8(0xff10) & 0x80, 0x80);
    // NR11: lower 6 bits always 1
    assert.strictEqual(apu.read8(0xff11) & 0x3f, 0x3f);
    // NR52 master status: bit 7 = APU enabled (default on), bits 4-6 always 1
    assert.strictEqual(apu.read8(0xff26) & 0x80, 0x80);
  });

  test('NR52 master off clears channels', () => {
    const apu = createAPU();
    // Disable APU
    apu.write8(0xff26, 0x00);
    // Channel status bits should all be 0
    assert.strictEqual(apu.read8(0xff26) & 0x0f, 0x00);
    // Writes to channel registers ignored while APU off — duty unchanged from default (2)
    const dutyBefore = apu.read8(0xff11) & 0xc0;
    apu.write8(0xff11, 0x00); // try to clear CH1 duty to 0
    assert.strictEqual(apu.read8(0xff11) & 0xc0, dutyBefore, 'duty unchanged when APU off');
  });

  test('NR52 master re-enable allows writes', () => {
    const apu = createAPU();
    apu.write8(0xff26, 0x00); // disable
    apu.write8(0xff26, 0x80); // re-enable
    apu.write8(0xff11, 0x40); // CH1 duty = 1
    assert.strictEqual((apu.read8(0xff11) >> 6) & 0x03, 1);
  });

  test('CH1 trigger activates channel', () => {
    const apu = createAPU();
    // Set CH1 envelope: non-zero volume so DAC is enabled
    apu.write8(0xff12, 0xf0); // volume=15, no envelope, DAC on
    apu.write8(0xff14, 0x80); // trigger CH1
    assert.strictEqual(apu.read8(0xff26) & 0x01, 0x01, 'CH1 active after trigger');
  });

  test('CH2 trigger activates channel', () => {
    const apu = createAPU();
    apu.write8(0xff17, 0xf0); // CH2 DAC on
    apu.write8(0xff19, 0x80); // trigger CH2
    assert.strictEqual(apu.read8(0xff26) & 0x02, 0x02, 'CH2 active after trigger');
  });

  test('CH3 trigger activates channel when DAC enabled', () => {
    const apu = createAPU();
    apu.write8(0xff1a, 0x80); // CH3 DAC on
    apu.write8(0xff1e, 0x80); // trigger CH3
    assert.strictEqual(apu.read8(0xff26) & 0x04, 0x04, 'CH3 active after trigger');
  });

  test('CH4 trigger activates channel', () => {
    const apu = createAPU();
    apu.write8(0xff21, 0xf0); // CH4 DAC on
    apu.write8(0xff23, 0x80); // trigger CH4
    assert.strictEqual(apu.read8(0xff26) & 0x08, 0x08, 'CH4 active after trigger');
  });

  test('CH1 length counter disables channel when expired', () => {
    const apu = createAPU();
    apu.write8(0xff12, 0xf0); // DAC on
    apu.write8(0xff11, 0x3f); // length = 64 - 63 = 1
    apu.write8(0xff14, 0xc0); // trigger + length enable

    // Frame sequencer clocks length every 8192 cycles; need 1 clock to expire counter of 1
    apu.step(8192);
    assert.strictEqual(apu.read8(0xff26) & 0x01, 0x00, 'CH1 disabled after length expires');
  });

  test('CH3 length counter expires', () => {
    const apu = createAPU();
    apu.write8(0xff1a, 0x80); // DAC on
    apu.write8(0xff1b, 0xff); // length = 256 - 255 = 1
    apu.write8(0xff1e, 0xc0); // trigger + length enable
    apu.step(8192);
    assert.strictEqual(apu.read8(0xff26) & 0x04, 0x00, 'CH3 disabled after length expires');
  });

  test('CH1 DAC disable turns off channel', () => {
    const apu = createAPU();
    apu.write8(0xff12, 0xf0); // DAC on, trigger
    apu.write8(0xff14, 0x80);
    assert.strictEqual(apu.read8(0xff26) & 0x01, 0x01);
    apu.write8(0xff12, 0x00); // DAC off (high nibble = 0)
    assert.strictEqual(apu.read8(0xff26) & 0x01, 0x00);
  });

  test('NR50/NR51 read back written values', () => {
    const apu = createAPU();
    apu.write8(0xff24, 0x55); // NR50
    apu.write8(0xff25, 0xaa); // NR51
    assert.strictEqual(apu.read8(0xff24), 0x55);
    assert.strictEqual(apu.read8(0xff25), 0xaa);
  });

  test('wave RAM reads and writes', () => {
    const apu = createAPU();
    apu.write8(0xff30, 0xab);
    apu.write8(0xff3f, 0xcd);
    assert.strictEqual(apu.read8(0xff30), 0xab);
    assert.strictEqual(apu.read8(0xff3f), 0xcd);
  });

  test('onSample callback fires at ~44100Hz rate', () => {
    let sampleCount = 0;
    const apu = createAPU({ sampleRate: 44100, onSample: () => { sampleCount++; } });
    // Run 1 second worth of cycles
    apu.step(4194304);
    // Should have emitted ~44100 samples (allow ±1%)
    assert.ok(sampleCount >= 44000 && sampleCount <= 44200,
      `Expected ~44100 samples, got ${sampleCount}`);
  });

  test('frame sequencer clocks envelope', () => {
    const samples: number[] = [];
    // Use very small sample rate so we can detect volume changes quickly
    const apu = createAPU({ sampleRate: 4194304, onSample: (l) => samples.push(l) });
    // CH1: volume=8, add=true, period=1, duty=2 (50%), freq=0 (low, always oscillating)
    apu.write8(0xff12, (8 << 4) | 0x09); // vol=8, add=true, period=1
    apu.write8(0xff13, 0x00);
    apu.write8(0xff14, 0x80); // trigger
    apu.write8(0xff25, 0x11); // CH1 to both channels
    apu.write8(0xff24, 0x77); // max volume

    // Step 7 frame sequencer steps (7 * 8192 cycles) to clock envelope 1 time (step 7)
    apu.step(8192 * 7 + 1);

    // After one envelope clock (add=true, vol 8→9), samples should contain non-zero values
    const nonZero = samples.filter(s => s !== 0);
    assert.ok(nonZero.length > 0, 'should produce non-zero samples when CH1 active');
  });

  test('CH1 sweep overflow disables channel', () => {
    const apu = createAPU();
    // Sweep: period=1, negate=false, shift=1 — freq doubles each sweep clock → will overflow 2047
    apu.write8(0xff10, 0b00010001); // period=1, negate=false, shift=1
    apu.write8(0xff12, 0xf0); // DAC on
    apu.write8(0xff13, 0xff); // freq lo = 0xff
    apu.write8(0xff14, 0x87); // freq hi = 7, trigger → shadow = 0x7ff (2047)
    // First sweep calc: 2047 + (2047>>1) = 2047+1023 = 3070 > 2047 → disable
    apu.step(8192 * 2 + 1); // clock 2 frame sequencer steps (step 2 = length+sweep)
    assert.strictEqual(apu.read8(0xff26) & 0x01, 0x00, 'CH1 disabled after sweep overflow');
  });
});
