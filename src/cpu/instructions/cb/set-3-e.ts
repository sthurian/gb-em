import type { Registers } from '../../cpu.js';

type Set3EDependencies = {
  registers: Registers;
};

const createSet3E = ({ registers }: Set3EDependencies) => ({
  mnemonic: 'SET 3,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = (registers.e | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3E };
