import type { Registers } from '../../cpu.js';

type Res4LDependencies = {
  registers: Registers;
};

const createRes4L = ({ registers }: Res4LDependencies) => ({
  mnemonic: 'RES 4,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = registers.l & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4L };
