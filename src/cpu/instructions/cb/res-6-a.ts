import type { Registers } from '../../cpu.js';

type Res6ADependencies = {
  registers: Registers;
};

const createRes6A = ({ registers }: Res6ADependencies) => ({
  mnemonic: 'RES 6,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6A };
