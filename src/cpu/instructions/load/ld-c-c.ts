import type { Registers } from '../../cpu.js';

type LdCCDependencies = { registers: Registers };

const createLdCC = ({ registers }: LdCCDependencies) => ({
  mnemonic: 'LD C,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCC };
