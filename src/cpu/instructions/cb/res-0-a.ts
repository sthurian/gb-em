import type { Registers } from '../../cpu.js';

type Res0ADependencies = {
  registers: Registers;
};

const createRes0A = ({ registers }: Res0ADependencies) => ({
  mnemonic: 'RES 0,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0A };
