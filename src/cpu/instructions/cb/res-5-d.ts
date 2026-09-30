import type { Registers } from '../../cpu.js';

type Res5DDependencies = {
  registers: Registers;
};

const createRes5D = ({ registers }: Res5DDependencies) => ({
  mnemonic: 'RES 5,D',
  bytes: 1,
  execute: () => {
    registers.d = registers.d & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5D };
