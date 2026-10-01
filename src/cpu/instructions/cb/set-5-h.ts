import type { Registers } from '../../cpu.js';

type Set5HDependencies = {
  registers: Registers;
};

const createSet5H = ({ registers }: Set5HDependencies) => ({
  mnemonic: 'SET 5,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = (registers.h | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5H };
