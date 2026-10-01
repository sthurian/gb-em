import type { Registers } from '../../cpu.js';

type Res4DDependencies = {
  registers: Registers;
};

const createRes4D = ({ registers }: Res4DDependencies) => ({
  mnemonic: 'RES 4,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = registers.d & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4D };
