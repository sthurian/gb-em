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
    execute: () => {
      const address = (registers.h << 8) | registers.l;
      registers.a = mmu.read8(address);
      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdAHLIndirect };
