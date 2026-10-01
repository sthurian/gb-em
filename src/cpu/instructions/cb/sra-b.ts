import type { Registers } from '../../cpu.js';

type SraBDependencies = {
  registers: Registers;
};

const createSraB = ({ registers }: SraBDependencies) => ({
  mnemonic: 'SRA B',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.b;
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    registers.b = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSraB };
