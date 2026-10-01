import type { Registers } from '../../cpu.js';

type Set1LDependencies = {
  registers: Registers;
};

const createSet1L = ({ registers }: Set1LDependencies) => ({
  mnemonic: 'SET 1,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1L };
