import type { Registers } from '../../cpu.js';

type AndADependencies = {
  registers: Registers;
};

const createAndA = ({ registers }: AndADependencies) => {
  return {
    mnemonic: 'AND A',
    bytes: 1,
    execute: () => {
      registers.a = registers.a & registers.a;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAndA };
