const GB_COLORS: [number, number, number][] = [
  [0xe0, 0xf8, 0xd0],
  [0x88, 0xc0, 0x70],
  [0x34, 0x68, 0x56],
  [0x08, 0x18, 0x20],
];

type BgRendererDeps = {
  vram: Uint8Array;
  framebuffer: Uint8ClampedArray;
  bgColorIndex: Uint8Array;
};

type BgRenderer = {
  render(ly: number, lcdc: number, bgp: number, scy: number, scx: number): void;
};

const createBgRenderer = ({ vram, framebuffer, bgColorIndex }: BgRendererDeps): BgRenderer => {
  const decodePalette = (palette: number) => [
    palette & 0x03,
    (palette >> 2) & 0x03,
    (palette >> 4) & 0x03,
    (palette >> 6) & 0x03,
  ];

  return {
    render: (ly, lcdc, bgp, scy, scx) => {
      if (!(lcdc & 0x01)) {
        bgColorIndex.fill(0);
        const [r, g, b] = GB_COLORS[0]!;
        for (let x = 0; x < 160; x++) {
          const i = (ly * 160 + x) * 4;
          framebuffer[i] = r; framebuffer[i + 1] = g; framebuffer[i + 2] = b; framebuffer[i + 3] = 255;
        }
        return;
      }

      const palette = decodePalette(bgp);
      const tileMapBase = (lcdc & 0x08) ? 0x1c00 : 0x1800;
      const signedAddr = !(lcdc & 0x10);
      const scrolledY = (ly + scy) & 0xff;
      const tileRow = (scrolledY >> 3) & 0x1f;

      for (let x = 0; x < 160; x++) {
        const scrolledX = (x + scx) & 0xff;
        const tileCol = (scrolledX >> 3) & 0x1f;
        const tileId = vram[tileMapBase + tileRow * 32 + tileCol]!;

        const tileAddr = signedAddr
          ? 0x1000 + (tileId < 0x80 ? tileId : tileId - 256) * 16
          : tileId * 16;

        const tileLine = (scrolledY & 0x07) * 2;
        const lo = vram[tileAddr + tileLine]!;
        const hi = vram[tileAddr + tileLine + 1]!;
        const bit = 7 - (scrolledX & 0x07);
        const colorIndex = ((hi >> bit) & 1) << 1 | ((lo >> bit) & 1);

        bgColorIndex[x] = colorIndex;
        const [r, g, b] = GB_COLORS[palette[colorIndex]!]!;
        const i = (ly * 160 + x) * 4;
        framebuffer[i] = r; framebuffer[i + 1] = g; framebuffer[i + 2] = b; framebuffer[i + 3] = 255;
      }
    },
  };
};

export { createBgRenderer, GB_COLORS };
export type { BgRenderer };
