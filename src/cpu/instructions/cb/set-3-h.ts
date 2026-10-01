import type { Registers } from '../../cpu.js';

type Set3HDependencies = {
  registers: Registers;
};

const createSet3H = ({ registers }: Set3HDependencies) => ({
  mnemonic: 'SET 3,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = (registers.h | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3H };
