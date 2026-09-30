import type { Registers } from '../../cpu.js';

type LdAADependencies = {
  registers: Registers;
};

const createLdAA = ({ registers }: LdAADependencies) => {
  return {
    mnemonic: 'LD A,A',
    bytes: 1,
    execute: () => {
      registers.a = registers.a;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAA };
