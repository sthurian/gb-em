import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JpNcA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJpNcA16 = ({ mmu, registers }: JpNcA16Dependencies) => {
  return {
    mnemonic: 'JP NC,a16',
    bytes: 3,
    execute: () => {
      const carry = (registers.f & 0x10) !== 0;

      if (!carry) {
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

export { createJpNcA16 };
