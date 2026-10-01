import type { Registers } from '../../cpu.js';

type Res0BDependencies = {
  registers: Registers;
};

const createRes0B = ({ registers }: Res0BDependencies) => ({
  mnemonic: 'RES 0,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.b = registers.b & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0B };
