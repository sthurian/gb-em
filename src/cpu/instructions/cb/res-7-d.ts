import type { Registers } from '../../cpu.js';

type Res7DDependencies = {
  registers: Registers;
};

const createRes7D = ({ registers }: Res7DDependencies) => ({
  mnemonic: 'RES 7,D',
  bytes: 1,
  execute: () => {
    registers.d = registers.d & ~(1 << 7) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes7D };
