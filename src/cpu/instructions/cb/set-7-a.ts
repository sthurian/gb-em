import type { Registers } from '../../cpu.js';

type Set7ADependencies = {
  registers: Registers;
};

const createSet7A = ({ registers }: Set7ADependencies) => ({
  mnemonic: 'SET 7,A',
  bytes: 1,
  execute: () => {
    registers.a = (registers.a | (1 << 7)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet7A };
