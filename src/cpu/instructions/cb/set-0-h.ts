import type { Registers } from '../../cpu.js';

type Set0HDependencies = {
  registers: Registers;
};

const createSet0H = ({ registers }: Set0HDependencies) => ({
  mnemonic: 'SET 0,H',
  bytes: 1,
  execute: () => {
    registers.h = (registers.h | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0H };
