import type { Registers } from '../../cpu.js';

type Set5CDependencies = {
  registers: Registers;
};

const createSet5C = ({ registers }: Set5CDependencies) => ({
  mnemonic: 'SET 5,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.c = (registers.c | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5C };
