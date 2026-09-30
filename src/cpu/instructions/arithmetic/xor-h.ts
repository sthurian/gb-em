import type { Registers } from '../../cpu.js';

type XorHDependencies = {
  registers: Registers;
};

const createXorH = ({ registers }: XorHDependencies) => {
  return {
    mnemonic: 'XOR H',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.h;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorH };
