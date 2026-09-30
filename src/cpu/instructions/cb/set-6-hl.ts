import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set6HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet6HL = ({ mmu, registers }: Set6HLDependencies) => ({
  mnemonic: 'SET 6,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    mmu.write8(addr, val | (1 << 6));
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet6HL };
