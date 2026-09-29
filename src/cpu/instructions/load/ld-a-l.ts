import type { Registers } from '../../cpu.js';

type LdALDependencies = {
  registers: Registers;
};

const createLdAL = ({ registers }: LdALDependencies) => {
  return {
    mnemonic: 'LD A,L',
    bytes: 1,
    execute: () => {
      registers.a = registers.l;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdAL };