import type { Registers } from '../../cpu.js';

type Bit2BDependencies = {
  registers: Registers;
};

const createBit2B = ({ registers }: Bit2BDependencies) => ({
  mnemonic: 'BIT 2,B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    registers.f = ((val & (1 << 2)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit2B };
