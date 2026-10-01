import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createPPU } from './ppu.js';
import { createInterruptController } from './interrupt-controller.js';

suite('PPU', () => {
  const makePPU = () => createPPU({ interruptController: createInterruptController() });

  test('can be created', () => {
    assert.ok(makePPU());
  });

  test('can be stepped by a number of cycles', () => {
    assert.doesNotThrow(() => makePPU().step(4));
  });

  test('LY increments after 456 dots', () => {
    const ppu = makePPU();
    for (let i = 0; i < 114; i++) ppu.step(4); // 114 * 4 = 456 dots
    assert.strictEqual(ppu.read8(0xff44), 1);
  });

  test('requests VBLANK interrupt at line 144', () => {
    const ic = createInterruptController();
    const ppu = createPPU({ interruptController: ic });
    for (let i = 0; i < 114 * 144; i++) ppu.step(4);
    assert.strictEqual(ic.read8(0xff0f) & 0x01, 1);
  });

  test('onFrame callback fires at VBlank', () => {
    let called = false;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: () => { called = true; },
    });
    for (let i = 0; i < 114 * 144; i++) ppu.step(4);
    assert.strictEqual(called, true);
  });

  test('reads and writes VRAM', () => {
    const ppu = makePPU();
    ppu.write8(0x8000, 0xab);
    assert.strictEqual(ppu.read8(0x8000), 0xab);
  });

  test('reads and writes OAM', () => {
    const ppu = makePPU();
    ppu.write8(0xfe00, 0x55);
    assert.strictEqual(ppu.read8(0xfe00), 0x55);
  });

  test('reads PPU registers', () => {
    const ppu = makePPU();
    assert.strictEqual(ppu.read8(0xff40), 0x91); // LCDC default
    assert.strictEqual(ppu.read8(0xff47), 0xfc); // BGP default
  });

  test('writes PPU registers', () => {
    const ppu = makePPU();
    ppu.write8(0xff42, 0x10); // SCY
    assert.strictEqual(ppu.read8(0xff42), 0x10);
    ppu.write8(0xff43, 0x08); // SCX
    assert.strictEqual(ppu.read8(0xff43), 0x08);
  });

  test('dmaTransfer copies bytes to OAM', () => {
    const ppu = makePPU();
    const source = new Uint8Array(0xa0);
    for (let i = 0; i < 0xa0; i++) source[i] = i & 0xff;
    ppu.dmaTransfer(0x0000, (addr) => source[addr] ?? 0);
    for (let i = 0; i < 0xa0; i++) {
      assert.strictEqual(ppu.read8(0xfe00 + i), i & 0xff);
    }
  });

  test('BG disabled: framebuffer uses color 0', () => {
    let frame: Uint8ClampedArray | null = null;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: (pixels) => { frame = pixels; },
    });

    // Disable BG (LCDC bit 0 = 0)
    ppu.write8(0xff40, 0x80); // LCD on, BG off

    // Run a full frame
    for (let i = 0; i < 114 * 154; i++) ppu.step(4);

    assert.ok(frame !== null);
    // All pixels should be color 0 (lightest green: 0xe0,0xf8,0xd0)
    const f = frame!;
    assert.strictEqual(f[0], 0xe0);
    assert.strictEqual(f[1], 0xf8);
    assert.strictEqual(f[2], 0xd0);
    assert.strictEqual(f[3], 255);
  });

  test('BG renders tile data from VRAM', () => {
    let frame: Uint8ClampedArray | null = null;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: (pixels) => { frame = pixels; },
    });

    // LCDC: LCD on, BG on, tile data 0x8000 (unsigned, bit4=1), tile map 0x9800 (bit3=0)
    ppu.write8(0xff40, 0x91);
    // Write tile 1 data at 0x8010 (tile index 1, unsigned): solid color 3
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8010 + row * 2, 0xff);     // lo byte: all bits set
      ppu.write8(0x8010 + row * 2 + 1, 0xff); // hi byte: all bits set → color 3
    }
    // Put tile 1 at tile map entry (0,0) = 0x9800
    ppu.write8(0x9800, 0x01);
    // BGP: color 3 → palette index 3
    ppu.write8(0xff47, 0xe4); // 0b11100100: color3=3,color2=2,color1=1,color0=0

    for (let i = 0; i < 114 * 154; i++) ppu.step(4);

    assert.ok(frame !== null);
    // Pixel (0,0) should be GB_COLORS[3] = [0x08, 0x18, 0x20]
    const f = frame!;
    assert.strictEqual(f[0], 0x08, 'R');
    assert.strictEqual(f[1], 0x18, 'G');
    assert.strictEqual(f[2], 0x20, 'B');
  });

  test('window layer renders over BG', () => {
    let frame: Uint8ClampedArray | null = null;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: (pixels) => { frame = pixels; },
    });

    // LCDC: LCD on, BG on, Window on (bit5=1), window map 0x9800 (bit6=0), tile data unsigned
    ppu.write8(0xff40, 0b10110001); // 0xb1
    // WX=7 (screen X=0), WY=0
    ppu.write8(0xff4a, 0x00); // WY
    ppu.write8(0xff4b, 0x07); // WX

    // Window tile 2 at 0x8020: solid color 2 (lo=0xff, hi=0x00 → color 1 actually)
    // Use lo=0x00, hi=0xff → color 2
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8020 + row * 2, 0x00);
      ppu.write8(0x8020 + row * 2 + 1, 0xff);
    }
    // Window tile map at 0x9800: tile index 2
    ppu.write8(0x9800, 0x02);

    // BG tile 0 at 0x8000: solid color 3 (should be overwritten by window)
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8000 + row * 2, 0xff);
      ppu.write8(0x8000 + row * 2 + 1, 0xff);
    }

    ppu.write8(0xff47, 0xe4);

    for (let i = 0; i < 114 * 154; i++) ppu.step(4);

    assert.ok(frame !== null);
    // Pixel (0,0): window tile 2, color 2 → GB_COLORS[2] = [0x34, 0x68, 0x56]
    const f = frame!;
    assert.strictEqual(f[0], 0x34, 'window R');
    assert.strictEqual(f[1], 0x68, 'window G');
    assert.strictEqual(f[2], 0x56, 'window B');
  });

  test('sprite renders over BG at correct position', () => {
    let frame: Uint8ClampedArray | null = null;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: (pixels) => { frame = pixels; },
    });

    // LCDC: LCD on, BG on, OBJ on (bit1=1), 8x8
    ppu.write8(0xff40, 0x83);

    // Sprite tile 0 at 0x8000: solid color 1 (lo=0xff, hi=0x00)
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8000 + row * 2, 0xff);
      ppu.write8(0x8000 + row * 2 + 1, 0x00);
    }

    // OAM entry 0: Y=16 (screen y=0), X=8 (screen x=0), tile=0, attrs=0 (OBP0, no flip, above BG)
    ppu.write8(0xfe00, 16); // Y
    ppu.write8(0xfe01, 8);  // X
    ppu.write8(0xfe02, 0);  // tile
    ppu.write8(0xfe03, 0);  // attrs

    // OBP0: color 1 → palette index 1 → GB_COLORS[1]
    ppu.write8(0xff48, 0xe4); // 0b11100100

    for (let i = 0; i < 114 * 154; i++) ppu.step(4);

    assert.ok(frame !== null);
    // Pixel (0,0): sprite color 1 → GB_COLORS[1] = [0x88, 0xc0, 0x70]
    const f = frame!;
    assert.strictEqual(f[0], 0x88, 'sprite R');
    assert.strictEqual(f[1], 0xc0, 'sprite G');
    assert.strictEqual(f[2], 0x70, 'sprite B');
  });

  test('sprite with BG priority hidden behind non-zero BG color', () => {
    let frame: Uint8ClampedArray | null = null;
    const ppu = createPPU({
      interruptController: createInterruptController(),
      onFrame: (pixels) => { frame = pixels; },
    });

    // LCDC: LCD on, BG on (unsigned tile data bit4=1), OBJ on
    ppu.write8(0xff40, 0x93); // 0b10010011

    // BG tile 0 at 0x8000 (unsigned): solid color 3
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8000 + row * 2, 0xff);
      ppu.write8(0x8000 + row * 2 + 1, 0xff);
    }
    ppu.write8(0xff47, 0xe4);

    // Sprite tile 1 at 0x8010: solid color 1 (lo=ff, hi=00)
    for (let row = 0; row < 8; row++) {
      ppu.write8(0x8010 + row * 2, 0xff);
      ppu.write8(0x8010 + row * 2 + 1, 0x00);
    }
    ppu.write8(0xfe00, 16); ppu.write8(0xfe01, 8); ppu.write8(0xfe02, 1);
    ppu.write8(0xfe03, 0x80); // BG priority bit set
    ppu.write8(0xff48, 0xe4);

    for (let i = 0; i < 114 * 154; i++) ppu.step(4);

    assert.ok(frame !== null);
    // Sprite hidden behind BG color 3 → see BG: GB_COLORS[3] = [0x08, 0x18, 0x20]
    const f = frame!;
    assert.strictEqual(f[0], 0x08);
    assert.strictEqual(f[1], 0x18);
    assert.strictEqual(f[2], 0x20);
  });

  test('LCD disable resets LY to 0', () => {
    const ppu = makePPU();
    // Step to line 5
    for (let i = 0; i < 114 * 5; i++) ppu.step(4);
    assert.strictEqual(ppu.read8(0xff44), 5);
    // Disable LCD
    ppu.write8(0xff40, 0x11); // bit7=0
    assert.strictEqual(ppu.read8(0xff44), 0, 'LY reset to 0 when LCD disabled');
  });

  test('STAT interrupt fires on LYC=LY match', () => {
    const ic = createInterruptController();
    const ppu = createPPU({ interruptController: ic });
    ppu.write8(0xff45, 0x02); // LYC = 2
    ppu.write8(0xff41, 0x40); // enable LYC=LY STAT interrupt (bit6)
    // Step to line 2
    for (let i = 0; i < 114 * 2; i++) ppu.step(4);
    assert.strictEqual(ic.read8(0xff0f) & 0x02, 0x02, 'LCD_STAT interrupt fired on LYC match');
  });
});
