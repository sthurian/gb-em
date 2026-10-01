import type { Registers } from '../../cpu.js';

type Set4ADependencies = {
  registers: Registers;
};

const createSet4A = ({ registers }: Set4ADependencies) => ({
  mnemonic: 'SET 4,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 4)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet4A };
