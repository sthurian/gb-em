import type { Registers } from '../../cpu.js';

type Set0ADependencies = {
  registers: Registers;
};

const createSet0A = ({ registers }: Set0ADependencies) => ({
  mnemonic: 'SET 0,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = (registers.a | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0A };
