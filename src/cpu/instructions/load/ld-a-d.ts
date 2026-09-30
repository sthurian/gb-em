import type { Registers } from '../../cpu.js';

type LdADDependencies = {
  registers: Registers;
};

const createLdAD = ({ registers }: LdADDependencies) => {
  return {
    mnemonic: 'LD A,D',
    bytes: 1,
    execute: () => {
      registers.a = registers.d;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAD };
