import type { Registers } from '../../cpu.js';

type Res2LDependencies = {
  registers: Registers;
};

const createRes2L = ({ registers }: Res2LDependencies) => ({
  mnemonic: 'RES 2,L',
  bytes: 1,
  execute: () => {
    registers.l = registers.l & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2L };
