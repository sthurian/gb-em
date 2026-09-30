import type { Registers } from '../../cpu.js';

type Res6HDependencies = {
  registers: Registers;
};

const createRes6H = ({ registers }: Res6HDependencies) => ({
  mnemonic: 'RES 6,H',
  bytes: 1,
  execute: () => {
    registers.h = registers.h & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6H };
