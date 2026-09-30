import type { Registers } from '../../cpu.js';

type Set4EDependencies = {
  registers: Registers;
};

const createSet4E = ({ registers }: Set4EDependencies) => ({
  mnemonic: 'SET 4,E',
  bytes: 1,
  execute: () => {
    registers.e = (registers.e | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4E };
