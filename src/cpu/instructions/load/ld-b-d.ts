import type { Registers } from '../../cpu.js';

type LdBDDependencies = {
  registers: Registers;
};

const createLdBD = ({ registers }: LdBDDependencies) => {
  return {
    mnemonic: 'LD B,D',
    bytes: 1,
    execute: () => {
      registers.b = registers.d;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBD };
