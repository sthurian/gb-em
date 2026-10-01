import type { Registers } from '../../cpu.js';

type Res3ADependencies = {
  registers: Registers;
};

const createRes3A = ({ registers }: Res3ADependencies) => ({
  mnemonic: 'RES 3,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.a = registers.a & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3A };
