import { GB_COLORS } from './bg-renderer.js';

type SpriteRendererDeps = {
  vram: Uint8Array;
  oam: Uint8Array;
  framebuffer: Uint8ClampedArray;
  bgColorIndex: Uint8Array;
};

type SpriteRenderer = {
  render(ly: number, lcdc: number, obp0: number, obp1: number): void;
};

const createSpriteRenderer = ({ vram, oam, framebuffer, bgColorIndex }: SpriteRendererDeps): SpriteRenderer => {
  const decodePalette = (palette: number) => [
    palette & 0x03,
    (palette >> 2) & 0x03,
    (palette >> 4) & 0x03,
    (palette >> 6) & 0x03,
  ];

  return {
    render: (ly, lcdc, obp0, obp1) => {
      if (!(lcdc & 0x02)) return;

      const tall = (lcdc & 0x04) !== 0;
      const spriteHeight = tall ? 16 : 8;

      type Sprite = { spriteX: number; spriteY: number; tile: number; attrs: number };
      const visible: Sprite[] = [];

      for (let i = 0; i < 40 && visible.length < 10; i++) {
        const base = i * 4;
        const rawY = oam[base]! - 16;
        if (rawY > ly || rawY + spriteHeight <= ly) continue;
        visible.push({ spriteX: oam[base + 1]! - 8, spriteY: rawY, tile: oam[base + 2]!, attrs: oam[base + 3]! });
      }

      visible.sort((a, b) => a.spriteX - b.spriteX);

      for (let si = visible.length - 1; si >= 0; si--) {
        const { spriteX, spriteY, tile: rawTile, attrs } = visible[si]!;

        const bgPriority = (attrs & 0x80) !== 0;
        const flipY      = (attrs & 0x40) !== 0;
        const flipX      = (attrs & 0x20) !== 0;
        const palette    = decodePalette((attrs & 0x10) ? obp1 : obp0);

        const tileIndex = tall ? rawTile & 0xfe : rawTile;
        let tileRow = ly - spriteY;
        if (flipY) tileRow = spriteHeight - 1 - tileRow;

        const tile = (tall && tileRow >= 8) ? tileIndex | 0x01 : tileIndex;
        const row = tileRow & 0x07;
        const tileAddr = tile * 16 + row * 2;
        const lo = vram[tileAddr]!;
        const hi = vram[tileAddr + 1]!;

        for (let px = 0; px < 8; px++) {
          const screenX = spriteX + px;
          if (screenX < 0 || screenX >= 160) continue;

          const bit = flipX ? px : 7 - px;
          const colorIndex = ((hi >> bit) & 1) << 1 | ((lo >> bit) & 1);
          if (colorIndex === 0) continue;

          if (bgPriority && bgColorIndex[screenX]! !== 0) continue;

          const [r, g, b] = GB_COLORS[palette[colorIndex]!]!;
          const i = (ly * 160 + screenX) * 4;
          framebuffer[i] = r; framebuffer[i + 1] = g; framebuffer[i + 2] = b; framebuffer[i + 3] = 255;
        }
      }
    },
  };
};

export { createSpriteRenderer };
export type { SpriteRenderer };
