import type { Registers } from '../../cpu.js';

type Bit3HDependencies = {
  registers: Registers;
};

const createBit3H = ({ registers }: Bit3HDependencies) => ({
  mnemonic: 'BIT 3,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    registers.f = ((val & (1 << 3)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit3H };
