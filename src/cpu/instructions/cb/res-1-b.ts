import type { Registers } from '../../cpu.js';

type Res1BDependencies = {
  registers: Registers;
};

const createRes1B = ({ registers }: Res1BDependencies) => ({
  mnemonic: 'RES 1,B',
  bytes: 1,
  execute: () => {
    registers.b = registers.b & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1B };
