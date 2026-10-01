import type { Registers } from '../../cpu.js';

type Set6ADependencies = {
  registers: Registers;
};

const createSet6A = ({ registers }: Set6ADependencies) => ({
  mnemonic: 'SET 6,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6A };
