import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdAIndirectA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdAIndirectA16 = ({
  mmu,
  registers,
}: LdAIndirectA16Dependencies) => {
  return {
    mnemonic: 'LD A,(a16)',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);
      const address = (high << 8) | low;

      registers.a = mmu.read8(address);
      registers.pc = (registers.pc + 3) & 0xffff;

      return 16;
    },
  };
};

export { createLdAIndirectA16 };