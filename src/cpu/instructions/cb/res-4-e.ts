import type { Registers } from '../../cpu.js';

type Res4EDependencies = {
  registers: Registers;
};

const createRes4E = ({ registers }: Res4EDependencies) => ({
  mnemonic: 'RES 4,E',
  bytes: 1,
  execute: () => {
    registers.e = registers.e & ~(1 << 4) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes4E };
