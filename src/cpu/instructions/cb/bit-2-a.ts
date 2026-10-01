import type { Registers } from '../../cpu.js';

type Bit2ADependencies = {
  registers: Registers;
};

const createBit2A = ({ registers }: Bit2ADependencies) => ({
  mnemonic: 'BIT 2,A',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.a;
    registers.f = ((val & (1 << 2)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit2A };
