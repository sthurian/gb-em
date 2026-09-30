import type { Registers } from '../../cpu.js';

type Set7DDependencies = {
  registers: Registers;
};

const createSet7D = ({ registers }: Set7DDependencies) => ({
  mnemonic: 'SET 7,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7D };
