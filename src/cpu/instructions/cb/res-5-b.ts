import type { Registers } from '../../cpu.js';

type Res5BDependencies = {
  registers: Registers;
};

const createRes5B = ({ registers }: Res5BDependencies) => ({
  mnemonic: 'RES 5,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = registers.b & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5B };
