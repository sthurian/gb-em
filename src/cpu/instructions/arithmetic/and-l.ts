import type { Registers } from '../../cpu.js';

type AndLDependencies = {
  registers: Registers;
};

const createAndL = ({ registers }: AndLDependencies) => {
  return {
    mnemonic: 'AND L',
    bytes: 1,
    execute: () => {
      registers.a = registers.a & registers.l;
      registers.f = (registers.a === 0 ? 0x80 : 0x00) | 0x20;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createAndL };
