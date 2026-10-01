import type { Registers } from '../../cpu.js';

type Set1ADependencies = {
  registers: Registers;
};

const createSet1A = ({ registers }: Set1ADependencies) => ({
  mnemonic: 'SET 1,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 1)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet1A };
