import type { Registers } from '../../cpu.js';

type XorADependencies = {
  registers: Registers;
};

const createXorA = ({ registers }: XorADependencies) => {
  return {
    mnemonic: 'XOR A',
    bytes: 1,
    execute: () => {
      registers.a = registers.a ^ registers.a;
      registers.f = /* c8 ignore next */ registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createXorA };
