import type { Registers } from '../../cpu.js';

type LdAHDependencies = {
  registers: Registers;
};

const createLdAH = ({ registers }: LdAHDependencies) => {
  return {
    mnemonic: 'LD A,H',
    bytes: 1,
    execute: () => {
      registers.a = registers.h;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAH };