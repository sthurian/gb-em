import type { Registers } from '../../cpu.js';

type Bit5EDependencies = {
  registers: Registers;
};

const createBit5E = ({ registers }: Bit5EDependencies) => ({
  mnemonic: 'BIT 5,E',
  bytes: 1,
  execute: () => {
    const val = registers.e;
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit5E };
