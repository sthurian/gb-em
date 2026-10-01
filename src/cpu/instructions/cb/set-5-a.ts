import type { Registers } from '../../cpu.js';

type Set5ADependencies = {
  registers: Registers;
};

const createSet5A = ({ registers }: Set5ADependencies) => ({
  mnemonic: 'SET 5,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5A };
