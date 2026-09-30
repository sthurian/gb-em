import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Bit2HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createBit2HL = ({ mmu, registers }: Bit2HLDependencies) => ({
  mnemonic: 'BIT 2,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    registers.f = ((val & (1 << 2)) === 0 ? 0x80 : 0x00) | 0x20 | (registers.f & 0x10);
    registers.pc = (registers.pc + 1) & 0xffff;

    return 12;
  },
});

export { createBit2HL };
