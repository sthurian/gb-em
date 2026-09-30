import type { Registers } from '../../cpu.js';

type Set4DDependencies = {
  registers: Registers;
};

const createSet4D = ({ registers }: Set4DDependencies) => ({
  mnemonic: 'SET 4,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4D };
