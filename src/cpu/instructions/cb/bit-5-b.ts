import type { Registers } from '../../cpu.js';

type Bit5BDependencies = {
  registers: Registers;
};

const createBit5B = ({ registers }: Bit5BDependencies) => ({
  mnemonic: 'BIT 5,B',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.b;
    registers.f = ((val & (1 << 5)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit5B };
