import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdBHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdBHLIndirect = ({ mmu, registers }: LdBHLIndirectDependencies) => {
  return {
    mnemonic: 'LD B,(HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      registers.b = mmu.read8(address); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdBHLIndirect };
