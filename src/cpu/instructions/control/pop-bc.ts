import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PopBcDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPopBc = ({ mmu, registers }: PopBcDependencies) => {
  return {
    mnemonic: 'POP BC',
    bytes: 1,
    execute: () => {
      const low = mmu.read8(registers.sp);
      const high = mmu.read8(registers.sp + 1);

      registers.c = low;
      registers.b = high;
      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 12;
    },
  };
};

export { createPopBc };