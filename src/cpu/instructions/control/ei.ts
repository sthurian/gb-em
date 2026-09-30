import type { Registers } from '../../cpu.js';

type EiDependencies = {
  registers: Registers;
};

const createEi = ({ registers }: EiDependencies) => {
  return {
    mnemonic: 'EI',
    bytes: 1,
    execute: () => {
      registers.imeScheduled = true;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createEi };
