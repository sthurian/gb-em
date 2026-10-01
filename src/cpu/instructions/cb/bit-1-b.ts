import type { Registers } from '../../cpu.js';

type Bit1BDependencies = {
  registers: Registers;
};

const createBit1B = ({ registers }: Bit1BDependencies) => ({
  mnemonic: 'BIT 1,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.b;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1B };
