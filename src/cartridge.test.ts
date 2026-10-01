import { strict as assert } from 'node:assert';
import { suite, test } from 'mocha';
import { createCartridge } from './cartridge.js';

// Build a ROM of `banks` * 16KB filled with zeros except header bytes
const makeRom = (banks: number, mbcType: number, ramSizeCode = 0): Uint8Array => {
  const data = new Uint8Array(banks * 0x4000);
  data[0x147] = mbcType;
  data[0x148] = Math.log2(banks) - 1; // romSizeCode: 0→2banks, 1→4banks, etc.
  data[0x149] = ramSizeCode;
  return data;
};

suite('Cartridge', () => {
  test('reads bytes from ROM', () => {
    const data = new Uint8Array([0x01, 0x02, 0x03]);
    const cartridge = createCartridge({ data });
    assert.equal(cartridge.read8(0), 0x01);
    assert.equal(cartridge.read8(1), 0x02);
    assert.equal(cartridge.read8(2), 0x03);
  });

  test('rejects invalid addresses', () => {
    const cartridge = createCartridge({ data: new Uint8Array(0x8000) });
    assert.throws(() => cartridge.read8(-1), RangeError);
    assert.throws(() => cartridge.read8(0x8000), RangeError);
  });

  test('hasExternalRam false for ROM-only', () => {
    const cartridge = createCartridge({ data: new Uint8Array(0x8000) });
    assert.strictEqual(cartridge.hasExternalRam, false);
  });

  // ── MBC1 ──────────────────────────────────────────────────────────────────

  test('MBC1: reads bank 0 at 0x0000-0x3fff', () => {
    const data = makeRom(4, 0x01);
    data[0x0000] = 0xaa;
    const cart = createCartridge({ data });
    assert.strictEqual(cart.read8(0x0000), 0xaa);
  });

  test('MBC1: switches ROM bank via 0x2000-0x3fff write', () => {
    const data = makeRom(4, 0x01);
    data[0x4000] = 0x11; // bank 1 start
    data[0x8000] = 0x22; // bank 2 start
    const cart = createCartridge({ data });

    cart.write8(0x2000, 0x02); // select bank 2
    assert.strictEqual(cart.read8(0x4000), 0x22);
  });

  test('MBC1: bank 0 write maps to bank 1', () => {
    const data = makeRom(4, 0x01);
    data[0x4000] = 0x55; // bank 1
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x00); // 0 → clamped to 1
    assert.strictEqual(cart.read8(0x4000), 0x55);
  });

  test('MBC1: upper bank bits via 0x4000-0x5fff', () => {
    const data = makeRom(64, 0x01); // 64 banks
    data[0x20 * 0x4000] = 0x33; // bank 32 (0x20)
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x00); // lo=0→1, but upper bits apply
    cart.write8(0x4000, 0x01); // hi=1 → bank = (1<<5)|1 = 33... nope: lo=0→1, (1<<5|1)=33
    // Set lo=0 (clamped to 1) then hi=1: bank = 0x21? No — need bank 32 = hi=1, lo=0→clamped to 1
    // Actually: (hi<<5)|lo, lo=0 → bank would be (1<<5|0) = 32 but lo=0 gets clamped to 1
    // So set lo to something that gives (1<<5|x) = 32. lo=0 gets clamped. Can't get bank 32 with MBC1.
    // Test bank 33: hi=1, lo=1
    data[0x21 * 0x4000] = 0x77; // bank 33
    cart.write8(0x2000, 0x01); // lo=1
    cart.write8(0x4000, 0x01); // hi=1 → (1<<5|1) = 33
    assert.strictEqual(cart.read8(0x4000), 0x77);
  });

  test('MBC1: mode 1 enables RAM banking', () => {
    const data = makeRom(4, 0x03, 0x03); // MBC1+RAM, 32KB RAM
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a); // enable RAM
    cart.write8(0x6000, 0x01); // mode 1 (RAM banking)
    cart.write8(0x4000, 0x02); // select RAM bank 2
    cart.write8(0xa000, 0xbe); // write to RAM bank 2
    // Switch to bank 0 and verify different data
    cart.write8(0x4000, 0x00); // RAM bank 0
    assert.strictEqual(cart.read8(0xa000), 0x00); // bank 0 unwritten
    // Switch back to bank 2
    cart.write8(0x4000, 0x02);
    assert.strictEqual(cart.read8(0xa000), 0xbe);
  });

  test('MBC1: RAM disabled returns 0xff', () => {
    const data = makeRom(4, 0x03, 0x02); // MBC1+RAM, 8KB
    const cart = createCartridge({ data });
    // RAM not enabled — read returns 0xff
    assert.strictEqual(cart.read8(0xa000), 0xff);
  });

  test('MBC1: enable and write RAM', () => {
    const data = makeRom(4, 0x03, 0x02); // 8KB RAM
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a); // enable RAM
    cart.write8(0xa000, 0x42);
    assert.strictEqual(cart.read8(0xa000), 0x42);
    cart.write8(0x0000, 0x00); // disable RAM
    assert.strictEqual(cart.read8(0xa000), 0xff);
  });

  test('MBC1: mode 1 bank 0 area reflects upper bits', () => {
    const data = makeRom(64, 0x01);
    data[0x20 * 0x4000 + 0x0001] = 0xcc; // bank 32, addr 1
    const cart = createCartridge({ data });
    cart.write8(0x4000, 0x01); // hi=1
    cart.write8(0x6000, 0x01); // mode 1
    // In mode 1, bank0 area = (hi<<5) & (numBanks-1) = 32
    assert.strictEqual(cart.read8(0x0001), 0xcc);
  });

  // ── MBC3 ──────────────────────────────────────────────────────────────────

  test('MBC3: switches ROM bank', () => {
    const data = makeRom(4, 0x13, 0x02); // MBC3+RAM+BATTERY, 8KB RAM
    data[0x8000] = 0x44; // bank 2
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x02);
    assert.strictEqual(cart.read8(0x4000), 0x44);
  });

  test('MBC3: bank 0 write maps to bank 1', () => {
    const data = makeRom(4, 0x13, 0x00);
    data[0x4000] = 0x99; // bank 1
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x00); // 0 → 1
    assert.strictEqual(cart.read8(0x4000), 0x99);
  });

  test('MBC3: RAM enable and write', () => {
    const data = makeRom(4, 0x13, 0x02);
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a);
    cart.write8(0xa000, 0xde);
    assert.strictEqual(cart.read8(0xa000), 0xde);
  });

  test('MBC3: RAM bank switching', () => {
    const data = makeRom(4, 0x13, 0x03); // 32KB RAM
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a); // enable RAM
    cart.write8(0x4000, 0x01); // RAM bank 1
    cart.write8(0xa000, 0xab);
    cart.write8(0x4000, 0x00); // RAM bank 0
    assert.strictEqual(cart.read8(0xa000), 0x00); // bank 0 unwritten (zero)
    cart.write8(0x4000, 0x01);
    assert.strictEqual(cart.read8(0xa000), 0xab);
  });

  test('MBC3: RAM write ignored when disabled', () => {
    const data = makeRom(4, 0x13, 0x02);
    const cart = createCartridge({ data });
    // RAM not enabled
    cart.write8(0xa000, 0x77);
    assert.strictEqual(cart.read8(0xa000), 0xff);
  });

  // ── MBC5 ──────────────────────────────────────────────────────────────────

  test('MBC5: switches ROM bank via 0x2000', () => {
    const data = makeRom(4, 0x19); // MBC5
    data[0x8000] = 0x55; // bank 2
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x02);
    assert.strictEqual(cart.read8(0x4000), 0x55);
  });

  test('MBC5: ROM bank high bit via 0x3000', () => {
    // 512 banks needs bit8 of bank number
    const data = makeRom(512, 0x19);
    data[0x100 * 0x4000] = 0x66; // bank 256 = bit8 set
    const cart = createCartridge({ data });
    cart.write8(0x2000, 0x00); // lo = 0
    cart.write8(0x3000, 0x01); // hi bit = 1 → bank 256
    assert.strictEqual(cart.read8(0x4000), 0x66);
  });

  test('MBC5: RAM enable and write', () => {
    const data = makeRom(4, 0x1b, 0x02); // MBC5+RAM, 8KB
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a);
    cart.write8(0xa000, 0xef);
    assert.strictEqual(cart.read8(0xa000), 0xef);
  });

  test('MBC5: RAM bank switching', () => {
    const data = makeRom(4, 0x1b, 0x04); // 128KB RAM (16 banks)
    const cart = createCartridge({ data });
    cart.write8(0x0000, 0x0a);
    cart.write8(0x4000, 0x03); // RAM bank 3
    cart.write8(0xa000, 0x12);
    cart.write8(0x4000, 0x00);
    assert.strictEqual(cart.read8(0xa000), 0x00); // bank 0 unwritten
    cart.write8(0x4000, 0x03);
    assert.strictEqual(cart.read8(0xa000), 0x12);
  });

  test('MBC5: RAM write ignored when disabled', () => {
    const data = makeRom(4, 0x1b, 0x02);
    const cart = createCartridge({ data });
    cart.write8(0xa000, 0x99);
    assert.strictEqual(cart.read8(0xa000), 0xff);
  });

  test('hasExternalRam true for MBC+RAM cartridge', () => {
    const data = makeRom(4, 0x03, 0x02);
    const cart = createCartridge({ data });
    assert.strictEqual(cart.hasExternalRam, true);
  });
});
