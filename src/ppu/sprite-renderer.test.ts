import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createSpriteRenderer } from './sprite-renderer.js';

const makeBuffers = () => ({
  vram: new Uint8Array(0x2000),
  oam: new Uint8Array(0xa0),
  framebuffer: new Uint8ClampedArray(160 * 144 * 4),
  bgColorIndex: new Uint8Array(160),
});

suite('SpriteRenderer', () => {
  test('can be created', () => {
    assert.ok(createSpriteRenderer(makeBuffers()));
  });

  test('no-op when OBJ disabled in LCDC', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0; // sprite at (0,0)
    vram[0] = 0xff; vram[1] = 0x00;
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    sp.render(0, 0x80, 0xe4, 0xff); // LCDC bit1=0 → OBJ off
    assert.strictEqual(framebuffer[0], 0); // untouched
  });

  test('renders sprite pixel with OBP0', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    // Sprite tile 0: solid color 1 (lo=0xff, hi=0x00)
    for (let row = 0; row < 8; row++) {
      vram[row * 2] = 0xff;
      vram[row * 2 + 1] = 0x00;
    }
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0; // Y=16→screen y=0, X=8→screen x=0
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    // LCDC=0x82: OBJ on, LCD on; OBP0=0xe4: color1→palette1
    sp.render(0, 0x82, 0xe4, 0xff);
    // GB_COLORS[1] = [0x88, 0xc0, 0x70]
    assert.strictEqual(framebuffer[0], 0x88, 'R');
    assert.strictEqual(framebuffer[1], 0xc0, 'G');
    assert.strictEqual(framebuffer[2], 0x70, 'B');
  });

  test('sprite color 0 is transparent', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    // Sprite tile: all pixels color 0 (lo=0x00, hi=0x00)
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0;
    framebuffer.fill(0xdd); // sentinel
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    sp.render(0, 0x82, 0xe4, 0xff);
    assert.strictEqual(framebuffer[0], 0xdd, 'transparent pixel untouched');
  });

  test('BG priority hides sprite behind non-zero BG', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    for (let row = 0; row < 8; row++) {
      vram[row * 2] = 0xff;
      vram[row * 2 + 1] = 0x00; // color 1
    }
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0x80; // BG priority bit
    bgColorIndex[0] = 3; // non-zero BG at x=0
    framebuffer.fill(0x55); // sentinel
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    sp.render(0, 0x82, 0xe4, 0xff);
    assert.strictEqual(framebuffer[0], 0x55, 'sprite hidden behind BG');
  });

  test('BG priority shows sprite over BG color 0', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    for (let row = 0; row < 8; row++) {
      vram[row * 2] = 0xff;
      vram[row * 2 + 1] = 0x00;
    }
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0x80; // BG priority bit
    bgColorIndex[0] = 0; // BG color 0 → sprite shows through
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    sp.render(0, 0x82, 0xe4, 0xff);
    assert.strictEqual(framebuffer[0], 0x88, 'sprite over BG color 0');
  });

  test('X-flip reverses pixel order', () => {
    const { vram, oam, framebuffer, bgColorIndex } = makeBuffers();
    // Tile with only bit 0 set: leftmost pixel (bit7) = color 0, rightmost (bit0) = color 1
    vram[0] = 0x01; vram[1] = 0x00; // lo=0x01 → only bit0 = 1
    oam[0] = 16; oam[1] = 8; oam[2] = 0; oam[3] = 0x20; // X-flip
    const sp = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });
    sp.render(0, 0x82, 0xe4, 0xff);
    // With X-flip: screen x=0 gets bit0 (color 1), screen x=7 gets bit7 (color 0)
    assert.strictEqual(framebuffer[0], 0x88, 'x-flip: leftmost pixel is color 1');
  });
});
