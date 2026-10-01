import type { Registers } from '../../cpu.js';

type Set7BDependencies = {
  registers: Registers;
};

const createSet7B = ({ registers }: Set7BDependencies) => ({
  mnemonic: 'SET 7,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = (registers.b | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7B };
