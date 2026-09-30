import type { Registers } from '../../cpu.js';

type LdBLDependencies = {
  registers: Registers;
};

const createLdBL = ({ registers }: LdBLDependencies) => {
  return {
    mnemonic: 'LD B,L',
    bytes: 1,
    execute: () => {
      registers.b = registers.l;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBL };
