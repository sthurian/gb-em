import type { Registers } from '../../cpu.js';

type DecBCDependencies = {
  registers: Registers;
};

const createDecBC = ({ registers }: DecBCDependencies) => {
  return {
    mnemonic: 'DEC BC',
    bytes: 1,
    execute: (tick = () => {}) => {
      const bc = (registers.b << 8) | registers.c;
      const result = (bc - 1) & 0xffff;

      registers.b = result >> 8;
      registers.c = result & 0xff;
      tick(); // internal M-cycle
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createDecBC };
