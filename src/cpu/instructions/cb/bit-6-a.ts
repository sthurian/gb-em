import type { Registers } from '../../cpu.js';

type Bit6ADependencies = {
  registers: Registers;
};

const createBit6A = ({ registers }: Bit6ADependencies) => ({
  mnemonic: 'BIT 6,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.a;
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit6A };
