import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdSpD16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdSpD16 = ({ mmu, registers }: LdSpD16Dependencies) => {
  return {
    mnemonic: 'LD SP,d16',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);

      registers.sp = (high << 8) | low;
      registers.pc = (registers.pc + 3) & 0xffff;

      return 12;
    },
  };
};

export { createLdSpD16 };