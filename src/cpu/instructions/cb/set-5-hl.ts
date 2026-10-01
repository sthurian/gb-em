import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set5HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet5HL = ({ mmu, registers }: Set5HLDependencies) => ({
  mnemonic: 'SET 5,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val | (1 << 5)); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet5HL };
