import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PopHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPopHL = ({ mmu, registers }: PopHLDependencies) => {
  return {
    mnemonic: 'POP HL',
    bytes: 1,
    execute: () => {
      const low = mmu.read8(registers.sp);
      const high = mmu.read8((registers.sp + 1) & 0xffff);

      registers.l = low;
      registers.h = high;
      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 12;
    },
  };
};

export { createPopHL };