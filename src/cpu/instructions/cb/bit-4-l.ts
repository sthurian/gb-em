import type { Registers } from '../../cpu.js';

type Bit4LDependencies = {
  registers: Registers;
};

const createBit4L = ({ registers }: Bit4LDependencies) => ({
  mnemonic: 'BIT 4,L',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.l;
    registers.f = ((val & (1 << 4)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit4L };
