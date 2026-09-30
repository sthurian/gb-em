import type { Registers } from '../../cpu.js';

type LdCADependencies = { registers: Registers };

const createLdCA = ({ registers }: LdCADependencies) => ({
  mnemonic: 'LD C,A',
  bytes: 1,
  execute: () => {
    registers.c = registers.a;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCA };
