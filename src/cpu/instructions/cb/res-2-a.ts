import type { Registers } from '../../cpu.js';

type Res2ADependencies = {
  registers: Registers;
};

const createRes2A = ({ registers }: Res2ADependencies) => ({
  mnemonic: 'RES 2,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2A };
