import type { Registers } from '../../cpu.js';

type Set4LDependencies = {
  registers: Registers;
};

const createSet4L = ({ registers }: Set4LDependencies) => ({
  mnemonic: 'SET 4,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4L };
