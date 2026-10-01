import type { Registers } from '../../cpu.js';

type Res7ADependencies = {
  registers: Registers;
};

const createRes7A = ({ registers }: Res7ADependencies) => ({
  mnemonic: 'RES 7,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 7) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes7A };
