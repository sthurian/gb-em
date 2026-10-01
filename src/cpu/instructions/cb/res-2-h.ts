import type { Registers } from '../../cpu.js';

type Res2HDependencies = {
  registers: Registers;
};

const createRes2H = ({ registers }: Res2HDependencies) => ({
  mnemonic: 'RES 2,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = registers.h & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2H };
