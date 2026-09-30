import type { Registers } from '../../cpu.js';

type Bit1ADependencies = {
  registers: Registers;
};

const createBit1A = ({ registers }: Bit1ADependencies) => ({
  mnemonic: 'BIT 1,A',
  bytes: 1,
  execute: () => {
    const val = registers.a;
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit1A };
