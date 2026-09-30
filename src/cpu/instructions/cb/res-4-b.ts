import type { Registers } from '../../cpu.js';

type Res4BDependencies = {
  registers: Registers;
};

const createRes4B = ({ registers }: Res4BDependencies) => ({
  mnemonic: 'RES 4,B',
  bytes: 1,
  execute: () => {
    registers.b = registers.b & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4B };
