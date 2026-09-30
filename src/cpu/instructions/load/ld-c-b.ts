import type { Registers } from '../../cpu.js';

type LdCBDependencies = { registers: Registers };

const createLdCB = ({ registers }: LdCBDependencies) => ({
  mnemonic: 'LD C,B',
  bytes: 1,
  execute: () => {
    registers.c = registers.b;
    registers.pc = (registers.pc + 1) & 0xffff;
    return 4;
  },
});

export { createLdCB };
