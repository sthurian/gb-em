import type { Registers } from '../../cpu.js';

type Res1DDependencies = {
  registers: Registers;
};

const createRes1D = ({ registers }: Res1DDependencies) => ({
  mnemonic: 'RES 1,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = registers.d & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1D };
