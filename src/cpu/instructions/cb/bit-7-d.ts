import type { Registers } from '../../cpu.js';

type Bit7DDependencies = {
  registers: Registers;
};

const createBit7D = ({ registers }: Bit7DDependencies) => ({
  mnemonic: 'BIT 7,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    registers.f = ((val & (1 << 7)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit7D };
