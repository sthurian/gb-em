import type { Registers } from '../../cpu.js';

type DaaDependencies = {
  registers: Registers;
};

const createDaa = (_deps: DaaDependencies) => {
  return {
    mnemonic: 'DAA',
    bytes: 1,
    execute: () => {
      throw new Error('DAA not implemented');
    },
  };
};

export { createDaa };
