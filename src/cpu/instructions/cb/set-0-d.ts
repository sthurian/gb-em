import type { Registers } from '../../cpu.js';

type Set0DDependencies = {
  registers: Registers;
};

const createSet0D = ({ registers }: Set0DDependencies) => ({
  mnemonic: 'SET 0,D',
  bytes: 1,
  execute: () => {
    registers.d = (registers.d | (1 << 0)) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSet0D };
