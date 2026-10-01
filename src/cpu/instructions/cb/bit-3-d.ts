import type { Registers } from '../../cpu.js';

type Bit3DDependencies = {
  registers: Registers;
};

const createBit3D = ({ registers }: Bit3DDependencies) => ({
  mnemonic: 'BIT 3,D',
  bytes: 1,
  execute: (tick = () => {}) => {
    const val = registers.d;
    registers.f = ((val & (1 << 3)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 8;
  },
});

export { createBit3D };
