import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type Set4HLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSet4HL = ({ mmu, registers }: Set4HLDependencies) => ({
  mnemonic: 'SET 4,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const addr = (registers.h << 8) | registers.l;
    const val = mmu.read8(addr); tick();
    mmu.write8(addr, val | (1 << 4)); tick();
    registers.pc = (registers.pc + 1) & 0xffff;

    return 16;
  },
});

export { createSet4HL };
