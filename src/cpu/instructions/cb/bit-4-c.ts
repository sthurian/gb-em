import type { Registers } from '../../cpu.js';

type Bit4CDependencies = {
  registers: Registers;
};

const createBit4C = ({ registers }: Bit4CDependencies) => ({
  mnemonic: 'BIT 4,C',
  bytes: 1,
  execute: () => {
    const val = registers.c;
    registers.f = ((val & (1 << 4)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit4C };
