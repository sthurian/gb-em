import type { Registers } from '../../cpu.js';

type Set5DDependencies = {
  registers: Registers;
};

const createSet5D = ({ registers }: Set5DDependencies) => ({
  mnemonic: 'SET 5,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = (registers.d | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5D };
