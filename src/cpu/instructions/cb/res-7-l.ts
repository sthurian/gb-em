import type { Registers } from '../../cpu.js';

type Res7LDependencies = {
  registers: Registers;
};

const createRes7L = ({ registers }: Res7LDependencies) => ({
  mnemonic: 'RES 7,L',
  bytes: 1,
  execute: () => {
    registers.l = registers.l & ~(1 << 7) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes7L };
