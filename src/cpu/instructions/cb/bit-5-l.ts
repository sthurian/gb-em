import type { Registers } from '../../cpu.js';

type Bit5LDependencies = {
  registers: Registers;
};

const createBit5L = ({ registers }: Bit5LDependencies) => ({
  mnemonic: 'BIT 5,L',
  bytes: 1,
  execute: () => {
    const val = registers.l;
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit5L };
