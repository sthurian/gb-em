import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RetCDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRetC = ({ mmu, registers }: RetCDependencies) => {
  return {
    mnemonic: 'RET C',
    bytes: 1,
    execute: () => {
      const carry = (registers.f & 0x10) !== 0;

      if (!carry) {
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

export { createRetC };
