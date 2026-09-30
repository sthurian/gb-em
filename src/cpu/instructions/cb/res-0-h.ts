import type { Registers } from '../../cpu.js';

type Res0HDependencies = {
  registers: Registers;
};

const createRes0H = ({ registers }: Res0HDependencies) => ({
  mnemonic: 'RES 0,H',
  bytes: 1,
  execute: () => {
    registers.h = registers.h & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0H };
