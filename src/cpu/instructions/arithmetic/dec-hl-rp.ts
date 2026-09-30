import type { Registers } from '../../cpu.js';

type DecHLRPDependencies = {
  registers: Registers;
};

const createDecHLRP = ({ registers }: DecHLRPDependencies) => {
  return {
    mnemonic: 'DEC HL',
    bytes: 1,
    execute: () => {
      const hl = (registers.h << 8) | registers.l;
      const result = (hl - 1) & 0xffff;

      registers.h = result >> 8;
      registers.l = result & 0xff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createDecHLRP };
