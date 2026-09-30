import type { Registers } from '../../cpu.js';

type CplDependencies = {
  registers: Registers;
};

const createCpl = ({ registers }: CplDependencies) => {
  return {
    mnemonic: 'CPL',
    bytes: 1,
    execute: () => {
      registers.a = (~registers.a) & 0xff;
      registers.f = (registers.f & 0x90) | 0x60;

      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createCpl };
