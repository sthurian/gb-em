import type { Registers } from '../../cpu.js';

type Res5HDependencies = {
  registers: Registers;
};

const createRes5H = ({ registers }: Res5HDependencies) => ({
  mnemonic: 'RES 5,H',
  bytes: 1,
  execute: () => {
    registers.h = registers.h & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5H };
