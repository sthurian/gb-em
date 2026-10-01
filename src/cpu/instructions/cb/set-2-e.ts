import type { Registers } from '../../cpu.js';

type Set2EDependencies = {
  registers: Registers;
};

const createSet2E = ({ registers }: Set2EDependencies) => ({
  mnemonic: 'SET 2,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = (registers.e | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2E };
