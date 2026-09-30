import type { Registers } from '../../cpu.js';

type Set4HDependencies = {
  registers: Registers;
};

const createSet4H = ({ registers }: Set4HDependencies) => ({
  mnemonic: 'SET 4,H',
  bytes: 1,
  execute: () => {
    registers.h = (registers.h | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4H };
