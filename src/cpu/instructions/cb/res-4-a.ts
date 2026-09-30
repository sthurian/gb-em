import type { Registers } from '../../cpu.js';

type Res4ADependencies = {
  registers: Registers;
};

const createRes4A = ({ registers }: Res4ADependencies) => ({
  mnemonic: 'RES 4,A',
  bytes: 1,
  execute: () => {
    registers.a = registers.a & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4A };
