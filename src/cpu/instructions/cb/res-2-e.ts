import type { Registers } from '../../cpu.js';

type Res2EDependencies = {
  registers: Registers;
};

const createRes2E = ({ registers }: Res2EDependencies) => ({
  mnemonic: 'RES 2,E',
  bytes: 1,
  execute: () => {
    registers.e = registers.e & ~(1 << 2) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes2E };
