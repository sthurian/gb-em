import type { Registers } from '../../cpu.js';

type Bit3EDependencies = {
  registers: Registers;
};

const createBit3E = ({ registers }: Bit3EDependencies) => ({
  mnemonic: 'BIT 3,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.e;
    registers.f = ((val & (1 << 3)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit3E };
