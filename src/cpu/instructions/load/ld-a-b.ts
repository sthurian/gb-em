import type { Registers } from '../../cpu.js';

type LdABDependencies = {
  registers: Registers;
};

const createLdAB = ({ registers }: LdABDependencies) => {
  return {
    mnemonic: 'LD A,B',
    bytes: 1,
    execute: () => {
      registers.a = registers.b;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAB };