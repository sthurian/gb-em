import type { Registers } from '../../cpu.js';

type Bit7HDependencies = {
  registers: Registers;
};

const createBit7H = ({ registers }: Bit7HDependencies) => ({
  mnemonic: 'BIT 7,H',
  bytes: 1,
  execute: () => {
    const val = registers.h;
    registers.f = ((val & (1 << 7)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit7H };
