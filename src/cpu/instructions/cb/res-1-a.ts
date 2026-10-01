import type { Registers } from '../../cpu.js';

type Res1ADependencies = {
  registers: Registers;
};

const createRes1A = ({ registers }: Res1ADependencies) => ({
  mnemonic: 'RES 1,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1A };
