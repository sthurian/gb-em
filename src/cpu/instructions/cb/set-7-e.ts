import type { Registers } from '../../cpu.js';

type Set7EDependencies = {
  registers: Registers;
};

const createSet7E = ({ registers }: Set7EDependencies) => ({
  mnemonic: 'SET 7,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = (registers.e | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7E };
