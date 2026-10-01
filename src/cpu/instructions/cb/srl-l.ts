import type { Registers } from '../../cpu.js';

type SrlLDependencies = {
  registers: Registers;
};

const createSrlL = ({ registers }: SrlLDependencies) => ({
  mnemonic: 'SRL L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    const result = (val >> 1) & 0xff;
    const carry = val & 1;
    registers.l = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSrlL };
