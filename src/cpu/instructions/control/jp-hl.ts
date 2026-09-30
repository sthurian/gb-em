import type { Registers } from '../../cpu.js';

type JpHLDependencies = {
  registers: Registers;
};

const createJpHL = ({ registers }: JpHLDependencies) => {
  return {
    mnemonic: 'JP (HL)',
    bytes: 1,
    execute: () => {
      registers.pc = (registers.h << 8) | registers.l;
      return 4;
    },
  };
};

export { createJpHL };
