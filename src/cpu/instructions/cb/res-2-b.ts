import type { Registers } from '../../cpu.js';

type Res2BDependencies = {
  registers: Registers;
};

const createRes2B = ({ registers }: Res2BDependencies) => ({
  mnemonic: 'RES 2,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = registers.b & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2B };
