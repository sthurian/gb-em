import type { Registers } from '../../cpu.js';

type Bit2CDependencies = {
  registers: Registers;
};

const createBit2C = ({ registers }: Bit2CDependencies) => ({
  mnemonic: 'BIT 2,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.c;
    registers.f = ((val & (1 << 2)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit2C };
