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

      return 4;
    },
  };
};

export { createDi };