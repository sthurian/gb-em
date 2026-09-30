import type { Registers } from '../../cpu.js';

type Res5ADependencies = {
  registers: Registers;
};

const createRes5A = ({ registers }: Res5ADependencies) => ({
  mnemonic: 'RES 5,A',
  bytes: 1,
  execute: () => {
    registers.a = registers.a & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5A };
