import type { Registers } from '../../cpu.js';

type Bit6BDependencies = {
  registers: Registers;
};

const createBit6B = ({ registers }: Bit6BDependencies) => ({
  mnemonic: 'BIT 6,B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit6B };
