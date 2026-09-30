import type { Registers } from '../../cpu.js';

type XorLDependencies = {
  registers: Registers;
};

const createXorL = ({ registers }: XorLDependencies) => {
  return {
    mnemonic: 'XOR L',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.l;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorL };
