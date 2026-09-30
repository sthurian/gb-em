import type { Registers } from '../../cpu.js';

type LdACDependencies = {
  registers: Registers;
};

const createLdAC = ({ registers }: LdACDependencies) => {
  return {
    mnemonic: 'LD A,C',
    bytes: 1,
    execute: () => {
      registers.a = registers.c;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAC };
