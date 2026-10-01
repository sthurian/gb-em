import type { Registers } from '../../cpu.js';

type Bit4DDependencies = {
  registers: Registers;
};

const createBit4D = ({ registers }: Bit4DDependencies) => ({
  mnemonic: 'BIT 4,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    registers.f = ((val & (1 << 4)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit4D };
