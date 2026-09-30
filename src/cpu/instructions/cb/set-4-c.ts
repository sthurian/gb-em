import type { Registers } from '../../cpu.js';

type Set4CDependencies = {
  registers: Registers;
};

const createSet4C = ({ registers }: Set4CDependencies) => ({
  mnemonic: 'SET 4,C',
  bytes: 1,
  execute: () => {
    registers.c = (registers.c | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4C };
