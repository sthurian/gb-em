import type { Registers } from '../../cpu.js';

type Set2ADependencies = {
  registers: Registers;
};

const createSet2A = ({ registers }: Set2ADependencies) => ({
  mnemonic: 'SET 2,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2A };
