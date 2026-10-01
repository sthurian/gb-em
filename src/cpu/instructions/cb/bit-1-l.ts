import type { Registers } from '../../cpu.js';

type Bit1LDependencies = {
  registers: Registers;
};

const createBit1L = ({ registers }: Bit1LDependencies) => ({
  mnemonic: 'BIT 1,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1L };
