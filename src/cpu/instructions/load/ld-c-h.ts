import type { Registers } from '../../cpu.js';

type LdCHDependencies = { registers: Registers };

const createLdCH = ({ registers }: LdCHDependencies) => ({
  mnemonic: 'LD C,H',
  bytes: 1,
  execute: () => {
    registers.c = registers.h;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCH };
