import type { Registers } from '../../cpu.js';

type Set2CDependencies = {
  registers: Registers;
};

const createSet2C = ({ registers }: Set2CDependencies) => ({
  mnemonic: 'SET 2,C',
  bytes: 1,
  execute: () => {
    registers.c = (registers.c | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2C };
