import type { Registers } from '../../cpu.js';

type Set2BDependencies = {
  registers: Registers;
};

const createSet2B = ({ registers }: Set2BDependencies) => ({
  mnemonic: 'SET 2,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2B };
