import type { Registers } from '../../cpu.js';

type NopDependencies = {
  registers: Registers;
};

const createNop = ({ registers }: NopDependencies) => ({
  mnemonic: 'NOP',
  bytes: 1,

  execute: () => {
    registers.pc = (registers.pc + 1) & 0xffff;

    return 4;
  },
});

export { createNop };