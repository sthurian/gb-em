import type { Registers } from '../../cpu.js';

type AndHDependencies = {
  registers: Registers;
};

const createAndH = ({ registers }: AndHDependencies) => {
  return {
    mnemonic: 'AND H',
    bytes: 1,
    execute: () => {
      registers.a = registers.a & registers.h;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAndH };
