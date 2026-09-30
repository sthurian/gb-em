import type { Registers } from '../../cpu.js';

type Res1HDependencies = {
  registers: Registers;
};

const createRes1H = ({ registers }: Res1HDependencies) => ({
  mnemonic: 'RES 1,H',
  bytes: 1,
  execute: () => {
    registers.h = registers.h & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1H };
