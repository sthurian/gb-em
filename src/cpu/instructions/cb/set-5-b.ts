import type { Registers } from '../../cpu.js';

type Set5BDependencies = {
  registers: Registers;
};

const createSet5B = ({ registers }: Set5BDependencies) => ({
  mnemonic: 'SET 5,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = (registers.b | (1 << 5)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet5B };
