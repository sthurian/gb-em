import type { Registers } from '../../cpu.js';

type Set0EDependencies = {
  registers: Registers;
};

const createSet0E = ({ registers }: Set0EDependencies) => ({
  mnemonic: 'SET 0,E',
  bytes: 1,
  execute: () => {
    registers.e = (registers.e | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0E };
