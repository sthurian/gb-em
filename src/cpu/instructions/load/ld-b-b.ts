import type { Registers } from '../../cpu.js';

type LdBBDependencies = {
  registers: Registers;
};

const createLdBB = ({ registers }: LdBBDependencies) => {
  return {
    mnemonic: 'LD B,B',
    bytes: 1,
    execute: () => {
      registers.b = registers.b;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBB };
