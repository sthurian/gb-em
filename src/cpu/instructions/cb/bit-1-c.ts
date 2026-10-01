import type { Registers } from '../../cpu.js';

type Bit1CDependencies = {
  registers: Registers;
};

const createBit1C = ({ registers }: Bit1CDependencies) => ({
  mnemonic: 'BIT 1,C',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.c;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1C };
