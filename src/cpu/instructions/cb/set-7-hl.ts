import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set7HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet7HL = ({ mmu, registers }: Set7HLDependencies) => ({
  mnemonic: 'SET 7,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val | (1 << 7)); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet7HL };
