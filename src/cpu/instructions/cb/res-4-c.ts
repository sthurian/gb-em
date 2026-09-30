import type { Registers } from '../../cpu.js';

type Res4CDependencies = {
  registers: Registers;
};

const createRes4C = ({ registers }: Res4CDependencies) => ({
  mnemonic: 'RES 4,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4C };
