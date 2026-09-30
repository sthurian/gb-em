import type { Registers } from '../../cpu.js';

type Set1HDependencies = {
  registers: Registers;
};

const createSet1H = ({ registers }: Set1HDependencies) => ({
  mnemonic: 'SET 1,H',
  bytes: 1,
  execute: () => {
    registers.h = (registers.h | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1H };
