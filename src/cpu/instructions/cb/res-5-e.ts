import type { Registers } from '../../cpu.js';

type Res5EDependencies = {
  registers: Registers;
};

const createRes5E = ({ registers }: Res5EDependencies) => ({
  mnemonic: 'RES 5,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = registers.e & ~(1 << 5) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes5E };
