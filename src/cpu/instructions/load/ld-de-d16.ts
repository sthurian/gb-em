import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdDeD16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdDeD16 = ({ mmu, registers }: LdDeD16Dependencies) => {
  return {
    mnemonic: 'LD DE,d16',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);

      registers.e = low;
      registers.d = high;
      registers.pc = (registers.pc + 3) & 0xffff;

      return 12;
    },
  };
};

export { createLdDeD16 };