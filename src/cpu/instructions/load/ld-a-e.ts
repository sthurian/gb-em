import type { Registers } from '../../cpu.js';

type LdAEDependencies = {
  registers: Registers;
};

const createLdAE = ({ registers }: LdAEDependencies) => {
  return {
    mnemonic: 'LD A,E',
    bytes: 1,
    execute: () => {
      registers.a = registers.e;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAE };
