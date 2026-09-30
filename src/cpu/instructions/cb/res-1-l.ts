import type { Registers } from '../../cpu.js';

type Res1LDependencies = {
  registers: Registers;
};

const createRes1L = ({ registers }: Res1LDependencies) => ({
  mnemonic: 'RES 1,L',
  bytes: 1,
  execute: () => {
    registers.l = registers.l & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1L };
