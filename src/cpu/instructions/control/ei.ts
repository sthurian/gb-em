import type { Registers } from '../../cpu.js';

type EiDependencies = {
  registers: Registers;
};

const createEi = ({ registers }: EiDependencies) => {
  return {
    mnemonic: 'EI',
    bytes: 1,
    execute: () => {
      // TODO: EI delay (IME enabled after next instruction) not implemented
      registers.ime = true;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createEi };
