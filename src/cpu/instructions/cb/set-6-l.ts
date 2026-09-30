import type { Registers } from '../../cpu.js';

type Set6LDependencies = {
  registers: Registers;
};

const createSet6L = ({ registers }: Set6LDependencies) => ({
  mnemonic: 'SET 6,L',
  bytes: 1,
  execute: () => {
    registers.l = (registers.l | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6L };
