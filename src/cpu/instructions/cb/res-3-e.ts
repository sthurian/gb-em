import type { Registers } from '../../cpu.js';

type Res3EDependencies = {
  registers: Registers;
};

const createRes3E = ({ registers }: Res3EDependencies) => ({
  mnemonic: 'RES 3,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    registers.e = registers.e & ~(1 << 3) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes3E };
