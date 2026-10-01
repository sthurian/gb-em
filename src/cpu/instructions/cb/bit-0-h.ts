import type { Registers } from '../../cpu.js';

type Bit0HDependencies = {
  registers: Registers;
};

const createBit0H = ({ registers }: Bit0HDependencies) => ({
  mnemonic: 'BIT 0,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    registers.f = ((val & (1 << 0)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit0H };
