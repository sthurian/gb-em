import type { Registers } from '../../cpu.js';

type Set6DDependencies = {
  registers: Registers;
};

const createSet6D = ({ registers }: Set6DDependencies) => ({
  mnemonic: 'SET 6,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6D };
