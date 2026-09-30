import type { Registers } from '../../cpu.js';

type LdCEDependencies = { registers: Registers };

const createLdCE = ({ registers }: LdCEDependencies) => ({
  mnemonic: 'LD C,E',
  bytes: 1,
  execute: () => {
    registers.c = registers.e;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCE };
