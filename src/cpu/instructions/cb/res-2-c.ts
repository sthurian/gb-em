import type { Registers } from '../../cpu.js';

type Res2CDependencies = {
  registers: Registers;
};

const createRes2C = ({ registers }: Res2CDependencies) => ({
  mnemonic: 'RES 2,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2C };
