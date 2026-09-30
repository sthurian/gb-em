import type { Registers } from '../../cpu.js';

type Res0EDependencies = {
  registers: Registers;
};

const createRes0E = ({ registers }: Res0EDependencies) => ({
  mnemonic: 'RES 0,E',
  bytes: 1,
  execute: () => {
    registers.e = registers.e & ~(1 << 0) & 0xff;
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createRes0E };
