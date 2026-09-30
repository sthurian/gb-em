import type { Registers } from '../../cpu.js';

type Res6BDependencies = {
  registers: Registers;
};

const createRes6B = ({ registers }: Res6BDependencies) => ({
  mnemonic: 'RES 6,B',
  bytes: 1,
  execute: () => {
    registers.b = registers.b & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6B };
