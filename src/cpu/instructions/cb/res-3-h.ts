import type { Registers } from '../../cpu.js';

type Res3HDependencies = {
  registers: Registers;
};

const createRes3H = ({ registers }: Res3HDependencies) => ({
  mnemonic: 'RES 3,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = registers.h & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3H };
