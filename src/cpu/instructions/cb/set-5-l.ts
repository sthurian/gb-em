import type { Registers } from '../../cpu.js';

type Set5LDependencies = {
  registers: Registers;
};

const createSet5L = ({ registers }: Set5LDependencies) => ({
  mnemonic: 'SET 5,L',
  bytes: 1,
  execute: () => {
    registers.l = (registers.l | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5L };
