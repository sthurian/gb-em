import type { Registers } from '../../cpu.js';

type Set6CDependencies = {
  registers: Registers;
};

const createSet6C = ({ registers }: Set6CDependencies) => ({
  mnemonic: 'SET 6,C',
  bytes: 1,
  execute: () => {
    registers.c = (registers.c | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6C };
