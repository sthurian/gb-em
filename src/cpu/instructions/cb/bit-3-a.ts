import type { Registers } from '../../cpu.js';

type Bit3ADependencies = {
  registers: Registers;
};

const createBit3A = ({ registers }: Bit3ADependencies) => ({
  mnemonic: 'BIT 3,A',
  bytes: 1,
  execute: () => {
    const val = registers.a;
    registers.f = ((val & (1 << 3)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit3A };
