import type { Registers } from '../../cpu.js';

type Res5CDependencies = {
  registers: Registers;
};

const createRes5C = ({ registers }: Res5CDependencies) => ({
  mnemonic: 'RES 5,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.c = registers.c & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5C };
