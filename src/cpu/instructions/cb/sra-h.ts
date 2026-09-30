import type { Registers } from '../../cpu.js';

type SraHDependencies = {
  registers: Registers;
};

const createSraH = ({ registers }: SraHDependencies) => ({
  mnemonic: 'SRA H',
  bytes: 1,
  execute: () => {
    const val = registers.h;
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    registers.h = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSraH };
