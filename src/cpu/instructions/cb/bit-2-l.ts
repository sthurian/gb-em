import type { Registers } from '../../cpu.js';

type Bit2LDependencies = {
  registers: Registers;
};

const createBit2L = ({ registers }: Bit2LDependencies) => ({
  mnemonic: 'BIT 2,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    registers.f = ((val & (1 << 2)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit2L };
