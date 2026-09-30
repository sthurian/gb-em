import type { Registers } from '../../cpu.js';

type XorEDependencies = {
  registers: Registers;
};

const createXorE = ({ registers }: XorEDependencies) => {
  return {
    mnemonic: 'XOR E',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.e;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorE };
