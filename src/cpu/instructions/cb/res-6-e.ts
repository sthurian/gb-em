import type { Registers } from '../../cpu.js';

type Res6EDependencies = {
  registers: Registers;
};

const createRes6E = ({ registers }: Res6EDependencies) => ({
  mnemonic: 'RES 6,E',
  bytes: 1,
  execute: () => {
    registers.e = registers.e & ~(1 << 6) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes6E };
