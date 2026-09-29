import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlD16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHlD16 = ({ mmu, registers }: LdHlD16Dependencies) => {
  return {
    mnemonic: 'LD HL,d16',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);

      registers.h = high;
      registers.l = low;
      registers.pc = (registers.pc + 3) & 0xffff;

      return 12;
    },
  };
};

export { createLdHlD16 };