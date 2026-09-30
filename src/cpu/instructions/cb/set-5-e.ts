import type { Registers } from '../../cpu.js';

type Set5EDependencies = {
  registers: Registers;
};

const createSet5E = ({ registers }: Set5EDependencies) => ({
  mnemonic: 'SET 5,E',
  bytes: 1,
  execute: () => {
    registers.e = (registers.e | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5E };
