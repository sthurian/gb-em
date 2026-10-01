import type { Registers } from '../../cpu.js';

type Set3LDependencies = {
  registers: Registers;
};

const createSet3L = ({ registers }: Set3LDependencies) => ({
  mnemonic: 'SET 3,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3L };
