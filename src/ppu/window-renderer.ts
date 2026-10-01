import { GB_COLORS } from './bg-renderer.js';

type WindowRendererDeps = {
  vram: Uint8Array;
  framebuffer: Uint8ClampedArray;
  bgColorIndex: Uint8Array;
};

type WindowRenderer = {
  render(ly: number, lcdc: number, bgp: number, wy: number, wx: number, windowLine: number): boolean;
};

const createWindowRenderer = ({ vram, framebuffer, bgColorIndex }: WindowRendererDeps): WindowRenderer => {
  const decodePalette = (palette: number) => [
    palette & 0x03,
    (palette >> 2) & 0x03,
    (palette >> 4) & 0x03,
    (palette >> 6) & 0x03,
  ];

  return {
    render: (ly, lcdc, bgp, wy, wx, windowLine) => {
      if (!(lcdc & 0x20)) return false;
      if (ly < wy) return false;
      const winX = wx - 7;
      if (winX >= 160) return false;

      const palette = decodePalette(bgp);
      const tileMapBase = (lcdc & 0x40) ? 0x1c00 : 0x1800;
      const signedAddr = !(lcdc & 0x10);
      const tileRow = (windowLine >> 3) & 0x1f;

      let drew = false;

      for (let x = 0; x < 160; x++) {
        const winPx = x - winX;
        if (winPx < 0) continue;

        const tileCol = (winPx >> 3) & 0x1f;
        const tileId = vram[tileMapBase + tileRow * 32 + tileCol]!;

        const tileAddr = signedAddr
          ? 0x1000 + (tileId < 0x80 ? tileId : tileId - 256) * 16
          : tileId * 16;

        const tileLine = (windowLine & 0x07) * 2;
        const lo = vram[tileAddr + tileLine]!;
        const hi = vram[tileAddr + tileLine + 1]!;
        const bit = 7 - (winPx & 0x07);
        const colorIndex = ((hi >> bit) & 1) << 1 | ((lo >> bit) & 1);

        bgColorIndex[x] = colorIndex;
        const [r, g, b] = GB_COLORS[palette[colorIndex]!]!;
        const i = (ly * 160 + x) * 4;
        framebuffer[i] = r; framebuffer[i + 1] = g; framebuffer[i + 2] = b; framebuffer[i + 3] = 255;
        drew = true;
      }

      return drew;
    },
  };
};

export { createWindowRenderer };
export type { WindowRenderer };
