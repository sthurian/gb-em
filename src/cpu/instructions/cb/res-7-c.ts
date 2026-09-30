import type { Registers } from '../../cpu.js';

type Res7CDependencies = {
  registers: Registers;
};

const createRes7C = ({ registers }: Res7CDependencies) => ({
  mnemonic: 'RES 7,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 7) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes7C };
