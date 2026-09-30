import type { Registers } from '../../cpu.js';

type Set1DDependencies = {
  registers: Registers;
};

const createSet1D = ({ registers }: Set1DDependencies) => ({
  mnemonic: 'SET 1,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1D };
