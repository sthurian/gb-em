import type { Registers } from '../../cpu.js';

type LdBHDependencies = {
  registers: Registers;
};

const createLdBH = ({ registers }: LdBHDependencies) => {
  return {
    mnemonic: 'LD B,H',
    bytes: 1,
    execute: () => {
      registers.b = registers.h;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBH };
