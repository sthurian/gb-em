import type { Registers } from '../../cpu.js';

type Set6BDependencies = {
  registers: Registers;
};

const createSet6B = ({ registers }: Set6BDependencies) => ({
  mnemonic: 'SET 6,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6B };
