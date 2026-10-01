import type { Registers } from '../../cpu.js';

type Set7LDependencies = {
  registers: Registers;
};

const createSet7L = ({ registers }: Set7LDependencies) => ({
  mnemonic: 'SET 7,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7L };
