import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set3HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet3HL = ({ mmu, registers }: Set3HLDependencies) => ({
  mnemonic: 'SET 3,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val | (1 << 3)); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet3HL };
