import type { Registers } from '../../cpu.js';

type SraADependencies = {
  registers: Registers;
};

const createSraA = ({ registers }: SraADependencies) => ({
  mnemonic: 'SRA A',
  bytes: 1,
  execute: () => {
    const val = registers.a;
    const result = ((val >> 1) | (val & 0x80)) & 0xff;
    const carry = val & 1;
    registers.a = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSraA };
