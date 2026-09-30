import type { Registers } from '../../cpu.js';

type Bit0BDependencies = {
  registers: Registers;
};

const createBit0B = ({ registers }: Bit0BDependencies) => ({
  mnemonic: 'BIT 0,B',
  bytes: 1,
  execute: () => {
    const val = registers.b;
    registers.f = ((val & (1 << 0)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit0B };
