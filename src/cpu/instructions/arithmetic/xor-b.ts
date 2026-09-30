import type { Registers } from '../../cpu.js';

type XorBDependencies = {
  registers: Registers;
};

const createXorB = ({ registers }: XorBDependencies) => {
  return {
    mnemonic: 'XOR B',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.b;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorB };
