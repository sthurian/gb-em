import type { Registers } from '../../cpu.js';

type CcfDependencies = {
  registers: Registers;
};

const createCcf = ({ registers }: CcfDependencies) => {
  return {
    mnemonic: 'CCF',
    bytes: 1,
    execute: () => {
      registers.f = (registers.f & 0x80) | ((registers.f & 0x10) ? 0x00 : 0x10);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createCcf };
