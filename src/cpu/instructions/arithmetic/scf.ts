import type { Registers } from '../../cpu.js';

type ScfDependencies = {
  registers: Registers;
};

const createScf = ({ registers }: ScfDependencies) => {
  return {
    mnemonic: 'SCF',
    bytes: 1,
    execute: () => {
      registers.f = (registers.f & 0x80) | 0x10;

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createScf };
