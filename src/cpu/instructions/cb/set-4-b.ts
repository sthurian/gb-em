import type { Registers } from '../../cpu.js';

type Set4BDependencies = {
  registers: Registers;
};

const createSet4B = ({ registers }: Set4BDependencies) => ({
  mnemonic: 'SET 4,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4B };
