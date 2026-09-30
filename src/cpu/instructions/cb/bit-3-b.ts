import type { Registers } from '../../cpu.js';

type Bit3BDependencies = {
  registers: Registers;
};

const createBit3B = ({ registers }: Bit3BDependencies) => ({
  mnemonic: 'BIT 3,B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    registers.f = ((val & (1 << 3)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit3B };
