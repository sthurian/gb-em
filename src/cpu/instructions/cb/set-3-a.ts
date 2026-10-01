import type { Registers } from '../../cpu.js';

type Set3ADependencies = {
  registers: Registers;
};

const createSet3A = ({ registers }: Set3ADependencies) => ({
  mnemonic: 'SET 3,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3A };
