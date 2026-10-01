import type { Registers } from '../../cpu.js';

type Bit5ADependencies = {
  registers: Registers;
};

const createBit5A = ({ registers }: Bit5ADependencies) => ({
  mnemonic: 'BIT 5,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.a;
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit5A };
