import type { Registers } from '../../cpu.js';

type Bit5CDependencies = {
  registers: Registers;
};

const createBit5C = ({ registers }: Bit5CDependencies) => ({
  mnemonic: 'BIT 5,C',
  bytes: 1,
  execute: () => {
    const val = registers.c;
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit5C };
