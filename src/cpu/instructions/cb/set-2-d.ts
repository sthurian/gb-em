import type { Registers } from '../../cpu.js';

type Set2DDependencies = {
  registers: Registers;
};

const createSet2D = ({ registers }: Set2DDependencies) => ({
  mnemonic: 'SET 2,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = (registers.d | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2D };
