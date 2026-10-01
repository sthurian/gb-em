import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createBgRenderer } from './bg-renderer.js';

const makeBuffers = () => ({
  vram: new Uint8Array(0x2000),
  framebuffer: new Uint8ClampedArray(160 * 144 * 4),
  bgColorIndex: new Uint8Array(160),
});

suite('BgRenderer', () => {
  test('can be created', () => {
    assert.ok(createBgRenderer(makeBuffers()));
  });

  test('BG disabled fills line with color 0', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    const bg = createBgRenderer({ vram, framebuffer, bgColorIndex });
    bg.render(0, 0x80, 0xe4, 0, 0); // LCDC bit0=0 → BG off
    assert.strictEqual(framebuffer[0], 0xe0); // GB_COLORS[0] R
    assert.strictEqual(framebuffer[1], 0xf8); // G
    assert.strictEqual(framebuffer[2], 0xd0); // B
    assert.strictEqual(framebuffer[3], 255);
  });

  test('BG disabled sets bgColorIndex to 0', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    const bg = createBgRenderer({ vram, framebuffer, bgColorIndex });
    bgColorIndex.fill(3);
    bg.render(0, 0x80, 0xe4, 0, 0);
    assert.ok(Array.from(bgColorIndex).every(v => v === 0));
  });

  test('BG renders tile color 3 from VRAM (unsigned addressing)', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    // Write tile 1: solid color 3 (lo=0xff, hi=0xff)
    for (let row = 0; row < 8; row++) {
      vram[0x0010 + row * 2] = 0xff;
      vram[0x0010 + row * 2 + 1] = 0xff;
    }
    // Tile map 0x9800 (vram offset 0x1800): tile 1 at (0,0)
    vram[0x1800] = 0x01;
    const bg = createBgRenderer({ vram, framebuffer, bgColorIndex });
    // LCDC=0x91: BG on, unsigned tile data (bit4=1), map 0x9800 (bit3=0)
    bg.render(0, 0x91, 0xe4, 0, 0);
    // Pixel (0,0): color index 3 → palette 3 → GB_COLORS[3] = [0x08, 0x18, 0x20]
    assert.strictEqual(framebuffer[0], 0x08, 'R');
    assert.strictEqual(framebuffer[1], 0x18, 'G');
    assert.strictEqual(framebuffer[2], 0x20, 'B');
  });

  test('bgColorIndex set correctly for rendered line', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    for (let row = 0; row < 8; row++) {
      vram[0x0010 + row * 2] = 0xff;
      vram[0x0010 + row * 2 + 1] = 0xff;
    }
    vram[0x1800] = 0x01;
    const bg = createBgRenderer({ vram, framebuffer, bgColorIndex });
    bg.render(0, 0x91, 0xe4, 0, 0);
    // First 8 pixels are on tile 1 (color 3), rest on tile 0 (color 0)
    assert.strictEqual(bgColorIndex[0], 3);
    assert.strictEqual(bgColorIndex[8], 0);
  });

  test('scroll (SCX) shifts tiles', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    // Place distinctive tile at column 1 (tile map x=1)
    for (let row = 0; row < 8; row++) {
      vram[0x0010 + row * 2] = 0xff;
      vram[0x0010 + row * 2 + 1] = 0xff;
    }
    vram[0x1801] = 0x01; // tile map column 1
    const bg = createBgRenderer({ vram, framebuffer, bgColorIndex });
    // SCX=8 scrolls right by 8px, so column 1 appears at screen x=0
    bg.render(0, 0x91, 0xe4, 0, 8);
    assert.strictEqual(bgColorIndex[0], 3, 'scroll brings tile 1 to x=0');
  });
});
