import type { Registers } from '../../cpu.js';

type Bit1DDependencies = {
  registers: Registers;
};

const createBit1D = ({ registers }: Bit1DDependencies) => ({
  mnemonic: 'BIT 1,D',
  bytes: 1,
  execute: () => {
    const val = registers.d;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1D };
