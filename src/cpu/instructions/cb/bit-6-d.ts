import type { Registers } from '../../cpu.js';

type Bit6DDependencies = {
  registers: Registers;
};

const createBit6D = ({ registers }: Bit6DDependencies) => ({
  mnemonic: 'BIT 6,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit6D };
