import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Bit6HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createBit6HL = ({ mmu, registers }: Bit6HLDependencies) => ({
  mnemonic: 'BIT 6,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    registers.f = ((val & (1 << 6)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createBit6HL };
