import type { Cartridge } from './cartridge.js';
import type { InterruptController } from './interrupt-controller.js';
import type { Serial } from './serial.js';
import type { Timer } from './timer.js';

type MMU = {
  read8(address: number): number;
  write8(address: number, value: number): void;
};

type MMUDependencies = {
  cartridge: Cartridge;
  interruptController: InterruptController;
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

const createMMU = ({ cartridge, interruptController, serial, timer }: MMUDependencies): MMU => {
  const memory: Memory = new Uint8Array(0x10000);

  return {
    read8: (address) => {
      assertAddress(address);

      if (address <= 0x7fff) {
        return cartridge.read8(address);
      }

      if (address === 0xff01 || address === 0xff02) {
        return serial.read8(address);
      }

      if (address >= 0xff04 && address <= 0xff07) {
        return timer.read8(address);
      }

      if (address === 0xff0f || address === 0xffff) {
        return interruptController.read8(address);
      }

      return memory[address]!;
    },

    write8: (address, value) => {
      assertAddress(address);
      assertByte(value);

      if (address === 0xff01 || address === 0xff02) {
        serial.write8(address, value);
        return;
      }

      if (address >= 0xff04 && address <= 0xff07) {
        timer.write8(address, value);
        return;
      }

      if (address === 0xff0f || address === 0xffff) {
        interruptController.write8(address, value);
        return;
      }

      memory[address] = value;
    },
  };
};

export { createMMU };
export type { MMU };
