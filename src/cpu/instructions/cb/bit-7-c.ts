import type { Registers } from '../../cpu.js';

type Bit7CDependencies = {
  registers: Registers;
};

const createBit7C = ({ registers }: Bit7CDependencies) => ({
  mnemonic: 'BIT 7,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.c;
    registers.f = ((val & (1 << 7)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit7C };
