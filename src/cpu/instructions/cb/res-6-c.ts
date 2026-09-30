import type { Registers } from '../../cpu.js';

type Res6CDependencies = {
  registers: Registers;
};

const createRes6C = ({ registers }: Res6CDependencies) => ({
  mnemonic: 'RES 6,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6C };
