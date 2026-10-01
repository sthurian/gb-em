import type { Registers } from '../../cpu.js';

type Res6LDependencies = {
  registers: Registers;
};

const createRes6L = ({ registers }: Res6LDependencies) => ({
  mnemonic: 'RES 6,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = registers.l & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6L };
