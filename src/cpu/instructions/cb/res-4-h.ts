import type { Registers } from '../../cpu.js';

type Res4HDependencies = {
  registers: Registers;
};

const createRes4H = ({ registers }: Res4HDependencies) => ({
  mnemonic: 'RES 4,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = registers.h & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4H };
