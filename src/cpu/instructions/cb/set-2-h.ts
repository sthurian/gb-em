import type { Registers } from '../../cpu.js';

type Set2HDependencies = {
  registers: Registers;
};

const createSet2H = ({ registers }: Set2HDependencies) => ({
  mnemonic: 'SET 2,H',
  bytes: 1,
  execute: () => {
    registers.h = (registers.h | (1 << 2)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet2H };
