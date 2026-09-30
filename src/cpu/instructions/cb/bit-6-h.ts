import type { Registers } from '../../cpu.js';

type Bit6HDependencies = {
  registers: Registers;
};

const createBit6H = ({ registers }: Bit6HDependencies) => ({
  mnemonic: 'BIT 6,H',
  bytes: 1,
  execute: () => {
    const val = registers.h;
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit6H };
