import type { Registers } from '../../cpu.js';

type Set7HDependencies = {
  registers: Registers;
};

const createSet7H = ({ registers }: Set7HDependencies) => ({
  mnemonic: 'SET 7,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.h = (registers.h | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7H };
