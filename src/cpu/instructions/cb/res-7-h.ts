import type { Registers } from '../../cpu.js';

type Res7HDependencies = {
  registers: Registers;
};

const createRes7H = ({ registers }: Res7HDependencies) => ({
  mnemonic: 'RES 7,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = registers.h & ~(1 << 7) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes7H };
