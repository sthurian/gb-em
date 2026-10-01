import type { Cartridge } from './cartridge.js';
import type { InterruptController } from './interrupt-controller.js';
import type { Joypad } from './joypad.js';
import type { PPU } from './ppu.js';
import type { Serial } from './serial.js';
import type { Timer } from './timer.js';

type MMU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type MMUDependencies = {
  cartridge: Cartridge;
  interruptController: InterruptController;
  joypad: Joypad;
  ppu: PPU;
  serial: Serial;
  timer: Timer;
};

type Memory = Uint8Array;

const assertAddress = (address: number): void => {
  if (!Number.isInteger(address) || address < 0 || address > 0xffff) {
    throw new RangeError(`Invalid address: ${address}`);
  }
};

const assertByte = (value: number): void => {
  if (!Number.isInteger(value) || value < 0 || value > 0xff) {
    throw new RangeError(`Invalid byte: ${value}`);
  }
};

const createMMU = ({ cartridge, interruptController, joypad, ppu, serial, timer }: MMUDependencies): MMU => {
  const memory: Memory = new Uint8Array(0x10000);

  return {
    read8: (address) => {
      assertAddress(address);

      if (address <= 0x7fff) return cartridge.read8(address);
      if (address >= 0xa000 && address <= 0xbfff && cartridge.hasExternalRam) return cartridge.read8(address);
      if (address >= 0x8000 && address <= 0x9fff) return ppu.read8(address);
      if (address >= 0xfe00 && address <= 0xfe9f) return ppu.read8(address);
      if (address === 0xff00) return joypad.read8(address);
      if (address === 0xff01 || address === 0xff02) return serial.read8(address);
      if (address >= 0xff04 && address <= 0xff07) return timer.read8(address);
      if (address === 0xff0f || address === 0xffff) return interruptController.read8(address);
      if (address >= 0xff40 && address <= 0xff4b) return ppu.read8(address);

      return memory[address]!;
    },

    write8: (address, value) => {
      assertAddress(address);
      assertByte(value);

      if (address <= 0x7fff) { cartridge.write8(address, value); return; }
      if (address >= 0xa000 && address <= 0xbfff && cartridge.hasExternalRam) { cartridge.write8(address, value); return; }
      if (address >= 0x8000 && address <= 0x9fff) { ppu.write8(address, value); return; }
      if (address >= 0xfe00 && address <= 0xfe9f) { ppu.write8(address, value); return; }
      if (address === 0xff00) { joypad.write8(address, value); return; }
      if (address === 0xff01 || address === 0xff02) { serial.write8(address, value); return; }
      if (address >= 0xff04 && address <= 0xff07) { timer.write8(address, value); return; }
      if (address === 0xff0f || address === 0xffff) { interruptController.write8(address, value); return; }
      if (address === 0xff46) {
        // OAM DMA transfer: copy 160 bytes from (value * 0x100) to OAM
        ppu.dmaTransfer(value * 0x100, (addr) => {
          assertAddress(addr);
          if (addr <= 0x7fff) return cartridge.read8(addr);
          return memory[addr]!;
        });
        return;
      }
      if (address >= 0xff40 && address <= 0xff4b) { ppu.write8(address, value); return; }

      memory[address] = value;
    },
  };
};

export { createMMU };
export type { MMU };
