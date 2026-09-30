import type { Registers } from '../../cpu.js';

type Bit7LDependencies = {
  registers: Registers;
};

const createBit7L = ({ registers }: Bit7LDependencies) => ({
  mnemonic: 'BIT 7,L',
  bytes: 1,
  execute: () => {
    const val = registers.l;
    registers.f = ((val & (1 << 7)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit7L };
