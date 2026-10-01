import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createWindowRenderer } from './window-renderer.js';

const makeBuffers = () => ({
  vram: new Uint8Array(0x2000),
  framebuffer: new Uint8ClampedArray(160 * 144 * 4),
  bgColorIndex: new Uint8Array(160),
});

suite('WindowRenderer', () => {
  test('can be created', () => {
    assert.ok(createWindowRenderer(makeBuffers()));
  });

  test('returns false when window disabled in LCDC', () => {
    const bufs = makeBuffers();
    const win = createWindowRenderer(bufs);
    const drew = win.render(0, 0x91, 0xe4, 0, 7, 0); // LCDC bit5=0
    assert.strictEqual(drew, false);
  });

  test('returns false when scanline above WY', () => {
    const bufs = makeBuffers();
    const win = createWindowRenderer(bufs);
    const drew = win.render(0, 0xb1, 0xe4, 5, 7, 0); // WY=5, ly=0
    assert.strictEqual(drew, false);
  });

  test('returns false when WX-7 >= 160', () => {
    const bufs = makeBuffers();
    const win = createWindowRenderer(bufs);
    const drew = win.render(0, 0xb1, 0xe4, 0, 167, 0); // WX=167 → winX=160
    assert.strictEqual(drew, false);
  });

  test('renders window tile at screen x=0 when WX=7', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    // Window tile 2 at 0x8020: lo=0x00, hi=0xff → color 2
    for (let row = 0; row < 8; row++) {
      vram[0x0020 + row * 2] = 0x00;
      vram[0x0020 + row * 2 + 1] = 0xff;
    }
    vram[0x1800] = 0x02; // window tile map at 0x9800
    const win = createWindowRenderer({ vram, framebuffer, bgColorIndex });
    // LCDC=0xb1: LCD on, BG on, Window on (bit5), window map 0x9800, tile data unsigned
    const drew = win.render(0, 0xb1, 0xe4, 0, 7, 0); // WY=0, WX=7, windowLine=0
    assert.strictEqual(drew, true);
    // Pixel (0,0): color 2 → GB_COLORS[2] = [0x34, 0x68, 0x56]
    assert.strictEqual(framebuffer[0], 0x34, 'R');
    assert.strictEqual(framebuffer[1], 0x68, 'G');
    assert.strictEqual(framebuffer[2], 0x56, 'B');
  });

  test('updates bgColorIndex for window pixels', () => {
    const { vram, framebuffer, bgColorIndex } = makeBuffers();
    for (let row = 0; row < 8; row++) {
      vram[0x0020 + row * 2] = 0x00;
      vram[0x0020 + row * 2 + 1] = 0xff;
    }
    vram[0x1800] = 0x02;
    bgColorIndex.fill(0);
    const win = createWindowRenderer({ vram, framebuffer, bgColorIndex });
    win.render(0, 0xb1, 0xe4, 0, 7, 0);
    assert.strictEqual(bgColorIndex[0], 2);
  });
});
