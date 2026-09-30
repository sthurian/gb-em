import type { Registers } from '../../cpu.js';

type Set1EDependencies = {
  registers: Registers;
};

const createSet1E = ({ registers }: Set1EDependencies) => ({
  mnemonic: 'SET 1,E',
  bytes: 1,
  execute: () => {
    registers.e = (registers.e | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1E };
