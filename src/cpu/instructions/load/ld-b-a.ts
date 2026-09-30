import type { Registers } from '../../cpu.js';

type LdBADependencies = {
  registers: Registers;
};

const createLdBA = ({ registers }: LdBADependencies) => {
  return {
    mnemonic: 'LD B,A',
    bytes: 1,
    execute: () => {
      registers.b = registers.a;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createLdBA };
