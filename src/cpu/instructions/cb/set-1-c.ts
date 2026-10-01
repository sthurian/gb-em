import type { Registers } from '../../cpu.js';

type Set1CDependencies = {
  registers: Registers;
};

const createSet1C = ({ registers }: Set1CDependencies) => ({
  mnemonic: 'SET 1,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.c = (registers.c | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1C };
