import type { Registers } from '../../cpu.js';

type AndEDependencies = {
  registers: Registers;
};

const createAndE = ({ registers }: AndEDependencies) => {
  return {
    mnemonic: 'AND E',
    bytes: 1,
    execute: () => {
      registers.a = registers.a & registers.e;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAndE };
