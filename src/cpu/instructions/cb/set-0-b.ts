import type { Registers } from '../../cpu.js';

type Set0BDependencies = {
  registers: Registers;
};

const createSet0B = ({ registers }: Set0BDependencies) => ({
  mnemonic: 'SET 0,B',
  bytes: 1,
  execute: () => {
    registers.b = (registers.b | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0B };
