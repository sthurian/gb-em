import type { Registers } from '../../cpu.js';

type Set0CDependencies = {
  registers: Registers;
};

const createSet0C = ({ registers }: Set0CDependencies) => ({
  mnemonic: 'SET 0,C',
  bytes: 1,
  execute: () => {
    registers.c = (registers.c | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0C };
