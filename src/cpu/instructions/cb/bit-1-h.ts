import type { Registers } from '../../cpu.js';

type Bit1HDependencies = {
  registers: Registers;
};

const createBit1H = ({ registers }: Bit1HDependencies) => ({
  mnemonic: 'BIT 1,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1H };
