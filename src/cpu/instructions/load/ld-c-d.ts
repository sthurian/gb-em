import type { Registers } from '../../cpu.js';

type LdCDDependencies = { registers: Registers };

const createLdCD = ({ registers }: LdCDDependencies) => ({
  mnemonic: 'LD C,D',
  bytes: 1,
  execute: () => {
    registers.c = registers.d;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCD };
