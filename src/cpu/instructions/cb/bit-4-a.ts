import type { Registers } from '../../cpu.js';

type Bit4ADependencies = {
  registers: Registers;
};

const createBit4A = ({ registers }: Bit4ADependencies) => ({
  mnemonic: 'BIT 4,A',
  bytes: 1,
  execute: () => {
    const val = registers.a;
    registers.f = ((val & (1 << 4)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit4A };
