import type { Registers } from '../../cpu.js';

type Set3BDependencies = {
  registers: Registers;
};

const createSet3B = ({ registers }: Set3BDependencies) => ({
  mnemonic: 'SET 3,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3B };
