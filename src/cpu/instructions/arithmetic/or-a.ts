import type { Registers } from '../../cpu.js';

type OrADependencies = {
  registers: Registers;
};

const createOrA = ({ registers }: OrADependencies) => {
  return {
    mnemonic: 'OR A',
    bytes: 1,
    execute: () => {
      registers.a = registers.a | registers.a;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createOrA };
