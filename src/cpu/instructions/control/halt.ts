import type { Registers } from '../../cpu.js';

type HaltDependencies = {
  registers: Registers;
};

const createHalt = (_deps: HaltDependencies) => {
  return {
    mnemonic: 'HALT',
    bytes: 1,
    execute: () => {
      throw new Error('HALT not implemented');
    },
  };
};

export { createHalt };
