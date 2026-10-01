import type { Registers } from '../../cpu.js';

type Res5LDependencies = {
  registers: Registers;
};

const createRes5L = ({ registers }: Res5LDependencies) => ({
  mnemonic: 'RES 5,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = registers.l & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5L };
