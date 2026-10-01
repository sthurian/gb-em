import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Bit1HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createBit1HL = ({ mmu, registers }: Bit1HLDependencies) => ({
  mnemonic: 'BIT 1,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    registers.f = ((val & (1 << 1)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createBit1HL };
