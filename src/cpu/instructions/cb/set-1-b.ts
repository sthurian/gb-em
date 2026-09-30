import type { Registers } from '../../cpu.js';

type Set1BDependencies = {
  registers: Registers;
};

const createSet1B = ({ registers }: Set1BDependencies) => ({
  mnemonic: 'SET 1,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1B };
