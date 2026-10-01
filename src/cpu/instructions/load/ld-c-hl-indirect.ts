import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdCHLIndirectDependencies = { mmu: MMU; registers: Registers };

const createLdCHLIndirect = ({ mmu, registers }: LdCHLIndirectDependencies) => ({
  mnemonic: 'LD C,(HL)',
  bytes: 1,
  execute: (tick = () => {}) => {
    const address = (registers.h << 8) | registers.l;
    registers.c = mmu.read8(address); tick();
    registers.pc = (registers.pc + 1) & 0xffff;
    return 8;
  },
});

export { createLdCHLIndirect };
