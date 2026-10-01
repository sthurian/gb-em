import type { Registers } from '../../cpu.js';

type Res3BDependencies = {
  registers: Registers;
};

const createRes3B = ({ registers }: Res3BDependencies) => ({
  mnemonic: 'RES 3,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = registers.b & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3B };
