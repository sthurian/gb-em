import type { Registers } from '../../cpu.js';

type Set2LDependencies = {
  registers: Registers;
};

const createSet2L = ({ registers }: Set2LDependencies) => ({
  mnemonic: 'SET 2,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2L };
