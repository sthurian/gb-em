import type { Registers } from '../../cpu.js';

type Set3DDependencies = {
  registers: Registers;
};

const createSet3D = ({ registers }: Set3DDependencies) => ({
  mnemonic: 'SET 3,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 3)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet3D };
