import type { Registers } from '../../cpu.js';

type LdBCDependencies = {
  registers: Registers;
};

const createLdBC = ({ registers }: LdBCDependencies) => {
  return {
    mnemonic: 'LD B,C',
    bytes: 1,
    execute: () => {
      registers.b = registers.c;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBC };
