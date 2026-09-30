import type { Registers } from '../../cpu.js';

type IncSPDependencies = {
  registers: Registers;
};

const createIncSP = ({ registers }: IncSPDependencies) => {
  return {
    mnemonic: 'INC SP',
    bytes: 1,
    execute: () => {
      registers.sp = (registers.sp + 1) & 0xffff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createIncSP };
