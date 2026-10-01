import type { Registers } from '../../cpu.js';

type Bit4HDependencies = {
  registers: Registers;
};

const createBit4H = ({ registers }: Bit4HDependencies) => ({
  mnemonic: 'BIT 4,H',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.h;
    registers.f = ((val & (1 << 4)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit4H };
