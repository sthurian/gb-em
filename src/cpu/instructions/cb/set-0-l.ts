import type { Registers } from '../../cpu.js';

type Set0LDependencies = {
  registers: Registers;
};

const createSet0L = ({ registers }: Set0LDependencies) => ({
  mnemonic: 'SET 0,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = (registers.l | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0L };
