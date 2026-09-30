import type { Registers } from '../../cpu.js';

type LdCLDependencies = { registers: Registers };

const createLdCL = ({ registers }: LdCLDependencies) => ({
  mnemonic: 'LD C,L',
  bytes: 1,
  execute: () => {
    registers.c = registers.l;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCL };
