import type { Registers } from '../../cpu.js';

type Res1EDependencies = {
  registers: Registers;
};

const createRes1E = ({ registers }: Res1EDependencies) => ({
  mnemonic: 'RES 1,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = registers.e & ~(1 << 1) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes1E };
