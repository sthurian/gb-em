import type { Registers } from '../../cpu.js';

type Res0CDependencies = {
  registers: Registers;
};

const createRes0C = ({ registers }: Res0CDependencies) => ({
  mnemonic: 'RES 0,C',
  bytes: 1,
  execute: () => {
    registers.c = registers.c & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0C };
