import type { Registers } from '../../cpu.js';

type LdBEDependencies = {
  registers: Registers;
};

const createLdBE = ({ registers }: LdBEDependencies) => {
  return {
    mnemonic: 'LD B,E',
    bytes: 1,
    execute: () => {
      registers.b = registers.e;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBE };
