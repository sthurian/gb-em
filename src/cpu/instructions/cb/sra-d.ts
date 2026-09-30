import type { Registers } from '../../cpu.js';

type SraDDependencies = {
  registers: Registers;
};

const createSraD = ({ registers }: SraDDependencies) => ({
  mnemonic: 'SRA D',
  bytes: 1,
  execute: () => {
    const val = registers.d;
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    registers.d = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSraD };
