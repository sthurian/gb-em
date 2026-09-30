import type { Registers } from '../../cpu.js';

type Set6HDependencies = {
  registers: Registers;
};

const createSet6H = ({ registers }: Set6HDependencies) => ({
  mnemonic: 'SET 6,H',
  bytes: 1,
  execute: () => {
    registers.h = (registers.h | (1 << 6)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet6H };
