import type { Registers } from '../../cpu.js';

type Set3CDependencies = {
  registers: Registers;
};

const createSet3C = ({ registers }: Set3CDependencies) => ({
  mnemonic: 'SET 3,C',
  bytes: 1,
  execute: () => {
    registers.c = (registers.c | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3C };
