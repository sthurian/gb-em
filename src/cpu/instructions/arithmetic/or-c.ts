import type { Registers } from '../../cpu.js';

type OrCDependencies = {
  registers: Registers;
};

const createOrC = ({ registers }: OrCDependencies) => {
  return {
    mnemonic: 'OR C',
    bytes: 1,
    execute: () => {
      registers.a = registers.a | registers.c;
      registers.f = registers.a === 0 ? 0x80 : 0x00;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 4;
    },
  };
};

export { createOrC };