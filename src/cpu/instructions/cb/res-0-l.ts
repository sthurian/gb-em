import type { Registers } from '../../cpu.js';

type Res0LDependencies = {
  registers: Registers;
};

const createRes0L = ({ registers }: Res0LDependencies) => ({
  mnemonic: 'RES 0,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.l = registers.l & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0L };
