import type { Registers } from '../../cpu.js';

type SraEDependencies = {
  registers: Registers;
};

const createSraE = ({ registers }: SraEDependencies) => ({
  mnemonic: 'SRA E',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.e;
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    registers.e = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSraE };
