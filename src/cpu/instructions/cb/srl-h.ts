import type { Registers } from '../../cpu.js';

type SrlHDependencies = {
  registers: Registers;
};

const createSrlH = ({ registers }: SrlHDependencies) => ({
  mnemonic: 'SRL H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    const result = (val >> 1) & 0xff;
    const carry = val & 1;
    registers.h = result;
    registers.f = (result === 0 ? 0x80 : 0x00) | (carry ? 0x10 : 0x00);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createSrlH };
