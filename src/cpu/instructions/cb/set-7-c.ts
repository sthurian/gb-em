import type { Registers } from '../../cpu.js';

type Set7CDependencies = {
  registers: Registers;
};

const createSet7C = ({ registers }: Set7CDependencies) => ({
  mnemonic: 'SET 7,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.c = (registers.c | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7C };
