import type { Registers } from '../../cpu.js';

type Res6DDependencies = {
  registers: Registers;
};

const createRes6D = ({ registers }: Res6DDependencies) => ({
  mnemonic: 'RES 6,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.d = registers.d & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6D };
