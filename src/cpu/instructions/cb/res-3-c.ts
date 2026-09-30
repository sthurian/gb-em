import type { Registers } from '../../cpu.js';

type Res3CDependencies = {
  registers: Registers;
};

const createRes3C = ({ registers }: Res3CDependencies) => ({
  mnemonic: 'RES 3,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3C };
