import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Bit0HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createBit0HL = ({ mmu, registers }: Bit0HLDependencies) => ({
  mnemonic: 'BIT 0,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    registers.f = ((val & (1 << 0)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createBit0HL };
