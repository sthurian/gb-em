import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JpZA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJpZA16 = ({ mmu, registers }: JpZA16Dependencies) => {
  return {
    mnemonic: 'JP Z,a16',
    bytes: 3,
    execute: () => {
      const zero = (registers.f & 0x80) !== 0;

      if (zero) {
        const low = mmu.read8(registers.pc + 1);
        const high = mmu.read8(registers.pc + 2);
        registers.pc = (high << 8) | low;
        return 16;
      }

      registers.pc = (registers.pc + 3) & 0xffff;
      return 12;
    },
  };
};

export { createJpZA16 };
