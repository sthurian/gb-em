import type { Registers } from '../../cpu.js';

type Set6EDependencies = {
  registers: Registers;
};

const createSet6E = ({ registers }: Set6EDependencies) => ({
  mnemonic: 'SET 6,E',
  bytes: 1,
  execute: () => {
    registers.e = (registers.e | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6E };
