import type { Registers } from '../../cpu.js';

type XorDDependencies = {
  registers: Registers;
};

const createXorD = ({ registers }: XorDDependencies) => {
  return {
    mnemonic: 'XOR D',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.d;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorD };
