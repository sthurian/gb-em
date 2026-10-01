import type { InterruptController } from './interrupt-controller.js';

type PPU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
  step(cycles: number): void;
  dmaTransfer(sourceBase: number, readByte: (addr: number) => number): void;
};

type PPUDependencies = {
  interruptController: InterruptController;
  onFrame?: (pixels: Uint8ClampedArray) => void;
};

// Dots per line = 456, lines 0-143 visible, 144-153 VBlank
// Mode 2 (OAM scan):  dots   0– 79  (80 dots)
// Mode 3 (drawing):   dots  80–251  (172 dots)
// Mode 0 (HBlank):    dots 252–455  (204 dots)
// Mode 1 (VBlank):    lines 144–153

const GB_COLORS: [number, number, number][] = [
  [0xe0, 0xf8, 0xd0], // 0 - lightest
  [0x88, 0xc0, 0x70], // 1
  [0x34, 0x68, 0x56], // 2
  [0x08, 0x18, 0x20], // 3 - darkest
];

const createPPU = ({ interruptController, onFrame }: PPUDependencies): PPU => {
  const vram = new Uint8Array(0x2000); // 0x8000–0x9FFF
  const oam  = new Uint8Array(0xa0);   // 0xFE00–0xFE9F

  let lcdc = 0x91;
  let stat = 0x00;
  let scy = 0;
  let scx = 0;
  let ly = 0;
  let lyc = 0;
  let bgp = 0xfc;
  let obp0 = 0xff;
  let obp1 = 0xff;
  let wy = 0;
  let wx = 0;
  let dots = 0;
  let windowLine = 0; // internal window line counter, reset each frame

  const framebuffer = new Uint8ClampedArray(160 * 144 * 4);
  // Raw BG palette index per pixel — needed for sprite-behind-BG priority
  const bgColorIndex = new Uint8Array(160);

  const lcdEnabled = () => (lcdc & 0x80) !== 0;

  const updateMode = () => {
    const vblank = ly >= 144;
    let mode: number;
    if (vblank) {
      mode = 1;
    } else if (dots < 80) {
      mode = 2;
    } else if (dots < 252) {
      mode = 3;
    } else {
      mode = 0;
    }
    const lycMatch = ly === lyc ? 0x04 : 0x00;
    stat = (stat & 0xf8) | lycMatch | mode;
  };

  const checkStatInterrupt = (prevStat: number) => {
    const mode = stat & 0x03;
    const lycMatch = (stat & 0x04) !== 0;
    const triggered =
      (mode === 0 && (stat & 0x08) !== 0) ||
      (mode === 1 && (stat & 0x10) !== 0) ||
      (mode === 2 && (stat & 0x20) !== 0) ||
      (lycMatch && (stat & 0x40) !== 0);
    const prevTriggered =
      ((prevStat & 0x03) === 0 && (prevStat & 0x08) !== 0) ||
      ((prevStat & 0x03) === 1 && (prevStat & 0x10) !== 0) ||
      ((prevStat & 0x03) === 2 && (prevStat & 0x20) !== 0) ||
      (((prevStat & 0x04) !== 0) && (prevStat & 0x40) !== 0);
    if (triggered && !prevTriggered) {
      interruptController.request('LCD_STAT');
    }
  };

  const decodePalette = (palette: number): number[] => [
    palette & 0x03,
    (palette >> 2) & 0x03,
    (palette >> 4) & 0x03,
    (palette >> 6) & 0x03,
  ];

  const renderBG = () => {
    if (!(lcdc & 0x01)) {
      bgColorIndex.fill(0);
      return;
    }

    const palette = decodePalette(bgp);
    const tileMapBase = (lcdc & 0x08) ? 0x1c00 : 0x1800;
    const signedAddressing = !(lcdc & 0x10);
    const scrolledY = (ly + scy) & 0xff;
    const tileRow = (scrolledY >> 3) & 0x1f;

    for (let x = 0; x < 160; x++) {
      const scrolledX = (x + scx) & 0xff;
      const tileCol = (scrolledX >> 3) & 0x1f;
      const tileMapIdx = tileMapBase + tileRow * 32 + tileCol;
      const tileId = vram[tileMapIdx]!;

      let tileAddr: number;
      if (signedAddressing) {
        const signedId = tileId < 0x80 ? tileId : tileId - 256;
        tileAddr = 0x1000 + signedId * 16;
      } else {
        tileAddr = tileId * 16;
      }

      const tileLine = (scrolledY & 0x07) * 2;
      const lo = vram[tileAddr + tileLine]!;
      const hi = vram[tileAddr + tileLine + 1]!;
      const bit = 7 - (scrolledX & 0x07);
      const colorIndex = ((hi >> bit) & 1) << 1 | ((lo >> bit) & 1);

      bgColorIndex[x] = colorIndex;

      const gbColor = palette[colorIndex]!;
      const [r, g, b] = GB_COLORS[gbColor]!;
      const fbIdx = (ly * 160 + x) * 4;
      framebuffer[fbIdx]     = r;
      framebuffer[fbIdx + 1] = g;
      framebuffer[fbIdx + 2] = b;
      framebuffer[fbIdx + 3] = 255;
    }
  };

  const renderWindow = () => {
    if (!(lcdc & 0x20)) return; // Window disabled
    if (ly < wy) return;        // Scanline above window start
    const winX = wx - 7;
    if (winX >= 160) return;    // Window off-screen right

    const palette = decodePalette(bgp);
    const tileMapBase = (lcdc & 0x40) ? 0x1c00 : 0x1800;
    const signedAddressing = !(lcdc & 0x10);
    const tileRow = (windowLine >> 3) & 0x1f;

    let drewAnyPixel = false;

    for (let x = 0; x < 160; x++) {
      const winPx = x - winX;
      if (winPx < 0) continue;

      const tileCol = (winPx >> 3) & 0x1f;
      const tileMapIdx = tileMapBase + tileRow * 32 + tileCol;
      const tileId = vram[tileMapIdx]!;

      let tileAddr: number;
      if (signedAddressing) {
        const signedId = tileId < 0x80 ? tileId : tileId - 256;
        tileAddr = 0x1000 + signedId * 16;
      } else {
        tileAddr = tileId * 16;
      }

      const tileLine = (windowLine & 0x07) * 2;
      const lo = vram[tileAddr + tileLine]!;
      const hi = vram[tileAddr + tileLine + 1]!;
      const bit = 7 - (winPx & 0x07);
      const colorIndex = ((hi >> bit) & 1) << 1 | ((lo >> bit) & 1);

      bgColorIndex[x] = colorIndex;

      const gbColor = palette[colorIndex]!;
      const [r, g, b] = GB_COLORS[gbColor]!;
      const fbIdx = (ly * 160 + x) * 4;
      framebuffer[fbIdx]     = r;
      framebuffer[fbIdx + 1] = g;
      framebuffer[fbIdx + 2] = b;
      framebuffer[fbIdx + 3] = 255;
      drewAnyPixel = true;
    }

    if (drewAnyPixel) windowLine++;
  };

  const renderSprites = () => {
    if (!(lcdc & 0x02)) return; // OBJ disabled

    const tall = (lcdc & 0x04) !== 0; // 8x16 mode
    const spriteHeight = tall ? 16 : 8;

    // Collect up to 10 visible sprites (OAM order = priority order)
    type SpriteEntry = { oamIdx: number; spriteX: number; spriteY: number; tile: number; attrs: number };
    const visible: SpriteEntry[] = [];

    for (let i = 0; i < 40 && visible.length < 10; i++) {
      const base = i * 4;
      const spriteY = (oam[base]! - 16) & 0xffff; // signed: -16..239
      const rawY = oam[base]! - 16;
      if (rawY > ly || rawY + spriteHeight <= ly) continue;
      visible.push({
        oamIdx: i,
        spriteX: oam[base + 1]! - 8,
        spriteY: rawY,
        tile: oam[base + 2]!,
        attrs: oam[base + 3]!,
      });
      void spriteY;
    }

    // DMG priority: lower X wins; ties broken by lower OAM index (already in order)
    // Sort by X ascending (stable — Array.sort is stable in modern JS)
    visible.sort((a, b) => a.spriteX - b.spriteX);

    // Render right-to-left in sorted order so lower-X sprites overwrite higher-X
    for (let si = visible.length - 1; si >= 0; si--) {
      const { spriteX, spriteY, tile: rawTile, attrs } = visible[si]!;

      const bgPriority = (attrs & 0x80) !== 0;
      const flipY      = (attrs & 0x40) !== 0;
      const flipX      = (attrs & 0x20) !== 0;
      const palette    = decodePalette((attrs & 0x10) ? obp1 : obp0);

      // 8x16: ignore bit 0 of tile index
      const tileIndex = tall ? rawTile & 0xfe : rawTile;

      let tileRow = ly - spriteY;
      if (flipY) tileRow = spriteHeight - 1 - tileRow;

      // For 8x16, row >= 8 means second tile (tileIndex | 1)
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
        if (colorIndex === 0) continue; // transparent

        // BG priority: sprite hidden behind BG colors 1-3
        if (bgPriority && bgColorIndex[screenX]! !== 0) continue;

        const gbColor = palette[colorIndex]!;
        const [r, g, b] = GB_COLORS[gbColor]!;
        const fbIdx = (ly * 160 + screenX) * 4;
        framebuffer[fbIdx]     = r;
        framebuffer[fbIdx + 1] = g;
        framebuffer[fbIdx + 2] = b;
        framebuffer[fbIdx + 3] = 255;
      }
    }
  };

  const renderScanline = () => {
    renderBG();
    renderWindow();
    renderSprites();
  };

  return {
    read8: (address) => {
      if (address >= 0x8000 && address <= 0x9fff) return vram[address - 0x8000]!;
      if (address >= 0xfe00 && address <= 0xfe9f) return oam[address - 0xfe00]!;
      switch (address) {
        case 0xff40: return lcdc;
        case 0xff41: return stat | 0x80;
        case 0xff42: return scy;
        case 0xff43: return scx;
        case 0xff44: return ly;
        case 0xff45: return lyc;
        case 0xff47: return bgp;
        case 0xff48: return obp0;
        case 0xff49: return obp1;
        case 0xff4a: return wy;
        case 0xff4b: return wx;
        default: return 0xff;
      }
    },

    write8: (address, value) => {
      if (address >= 0x8000 && address <= 0x9fff) { vram[address - 0x8000] = value; return; }
      if (address >= 0xfe00 && address <= 0xfe9f) { oam[address - 0xfe00] = value; return; }
      switch (address) {
        case 0xff40:
          if ((lcdc & 0x80) && !(value & 0x80)) { ly = 0; dots = 0; }
          lcdc = value;
          break;
        case 0xff41: stat = (stat & 0x07) | (value & 0x78); break;
        case 0xff42: scy = value; break;
        case 0xff43: scx = value; break;
        case 0xff44: break; // LY read-only
        case 0xff45: lyc = value; updateMode(); break;
        case 0xff47: bgp = value; break;
        case 0xff48: obp0 = value; break;
        case 0xff49: obp1 = value; break;
        case 0xff4a: wy = value; break;
        case 0xff4b: wx = value; break;
      }
    },

    dmaTransfer: (sourceBase, readByte) => {
      for (let i = 0; i < 0xa0; i++) {
        oam[i] = readByte(sourceBase + i);
      }
    },

    step: (cycles) => {
      if (!lcdEnabled()) return;

      const prevStat = stat;
      const prevDots = dots;
      dots += cycles;

      if (dots >= 456) {
        dots -= 456;
        ly = (ly + 1) % 154;

        if (ly === 144) {
          interruptController.request('VBLANK');
          onFrame?.(framebuffer);
        }
        if (ly === 0) windowLine = 0;
      } else if (prevDots < 252 && dots >= 252 && ly < 144) {
        // Mode 3 → HBlank transition: render scanline
        renderScanline();
      }

      updateMode();
      checkStatInterrupt(prevStat);
    },
  };
};

export { createPPU };
export type { PPU };
