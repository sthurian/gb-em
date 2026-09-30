import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RetZDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRetZ = ({ mmu, registers }: RetZDependencies) => {
  return {
    mnemonic: 'RET Z',
    bytes: 1,
    execute: () => {
      const zero = (registers.f & 0x80) !== 0;

      if (!zero) {
        registers.pc = (registers.pc + 1) & 0xffff;
        return 8;
      }

      const low = mmu.read8(registers.sp);
      const high = mmu.read8(registers.sp + 1);

      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (high << 8) | low;

      return 20;
    },
  };
};

export { createRetZ };
