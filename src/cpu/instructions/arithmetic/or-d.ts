import type { Registers } from '../../cpu.js';

type OrDDependencies = {
  registers: Registers;
};

const createOrD = ({ registers }: OrDDependencies) => {
  return {
    mnemonic: 'OR D',
    bytes: 1,
    execute: () => {
      registers.a = registers.a | registers.d;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createOrD };
