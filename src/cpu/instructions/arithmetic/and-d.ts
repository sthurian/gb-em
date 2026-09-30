import type { Registers } from '../../cpu.js';

type AndDDependencies = {
  registers: Registers;
};

const createAndD = ({ registers }: AndDDependencies) => {
  return {
    mnemonic: 'AND D',
    bytes: 1,
    execute: () => {
      registers.a = registers.a & registers.d;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAndD };
