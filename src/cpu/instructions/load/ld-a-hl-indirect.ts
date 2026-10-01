import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAHLIndirect = ({ mmu, registers }: LdAHLIndirectDependencies) => {
  return {
    mnemonic: 'LD A,(HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      registers.a = mmu.read8(address); tick();
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdAHLIndirect };
