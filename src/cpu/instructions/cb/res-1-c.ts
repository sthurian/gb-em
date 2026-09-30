import type { Registers } from '../../cpu.js';

type Res1CDependencies = {
  registers: Registers;
};

const createRes1C = ({ registers }: Res1CDependencies) => ({
  mnemonic: 'RES 1,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1C };
