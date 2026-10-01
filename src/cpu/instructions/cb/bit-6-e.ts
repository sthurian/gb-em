import type { Registers } from '../../cpu.js';

type Bit6EDependencies = {
  registers: Registers;
};

const createBit6E = ({ registers }: Bit6EDependencies) => ({
  mnemonic: 'BIT 6,E',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.e;
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit6E };
