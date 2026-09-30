import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set2HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet2HL = ({ mmu, registers }: Set2HLDependencies) => ({
  mnemonic: 'SET 2,(HL)',
  bytes: 1,
  execute: () => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr);
    mmu.write8(addr, val | (1 << 2));
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet2HL };
