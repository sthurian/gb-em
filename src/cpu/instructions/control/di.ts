import type { Registers } from '../../cpu.js';

type DiDependencies = {
  registers: Registers;
};

const createDi = ({ registers }: DiDependencies) => {
  return {
    mnemonic: 'DI',
    bytes: 1,
    execute: () => {
      registers.ime = false;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createDi };