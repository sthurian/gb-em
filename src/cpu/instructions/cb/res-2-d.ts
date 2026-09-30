import type { Registers } from '../../cpu.js';

type Res2DDependencies = {
  registers: Registers;
};

const createRes2D = ({ registers }: Res2DDependencies) => ({
  mnemonic: 'RES 2,D',
  bytes: 1,
  execute: () => {
    registers.d = registers.d & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2D };
