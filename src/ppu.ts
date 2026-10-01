import type { InterruptController } from './interrupt-controller.js';
import { createBgRenderer } from './ppu/bg-renderer.js';
import { createWindowRenderer } from './ppu/window-renderer.js';
import { createSpriteRenderer } from './ppu/sprite-renderer.js';

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

const createPPU = ({ interruptController, onFrame }: PPUDependencies): PPU => {
  const vram = new Uint8Array(0x2000);
  const oam  = new Uint8Array(0xa0);
  const framebuffer = new Uint8ClampedArray(160 * 144 * 4);
  const bgColorIndex = new Uint8Array(160);

  const bg      = createBgRenderer({ vram, framebuffer, bgColorIndex });
  const win     = createWindowRenderer({ vram, framebuffer, bgColorIndex });
  const sprites = createSpriteRenderer({ vram, oam, framebuffer, bgColorIndex });

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
  let windowLine = 0;

  const lcdEnabled = () => (lcdc & 0x80) !== 0;

  const updateMode = () => {
    const vblank = ly >= 144;
    let mode: number;
    if (vblank) mode = 1;
    else if (dots < 80) mode = 2;
    else if (dots < 252) mode = 3;
    else mode = 0;
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
    if (triggered && !prevTriggered) interruptController.request('LCD_STAT');
  };

  const renderScanline = () => {
    bg.render(ly, lcdc, bgp, scy, scx);
    const drew = win.render(ly, lcdc, bgp, wy, wx, windowLine);
    if (drew) windowLine++;
    sprites.render(ly, lcdc, obp0, obp1);
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
        case 0xff44: break;
        case 0xff45: lyc = value; updateMode(); break;
        case 0xff47: bgp = value; break;
        case 0xff48: obp0 = value; break;
        case 0xff49: obp1 = value; break;
        case 0xff4a: wy = value; break;
        case 0xff4b: wx = value; break;
      }
    },

    dmaTransfer: (sourceBase, readByte) => {
      for (let i = 0; i < 0xa0; i++) oam[i] = readByte(sourceBase + i);
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
        renderScanline();
      }

      updateMode();
      checkStatInterrupt(prevStat);
    },
  };
};

export { createPPU };
export type { PPU };
