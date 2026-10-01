import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PopDEDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPopDE = ({ mmu, registers }: PopDEDependencies) => {
  return {
    mnemonic: 'POP DE',
    bytes: 1,
    execute: (tick = () => {}) => {
      const low = mmu.read8(registers.sp); tick();
      const high = mmu.read8(registers.sp + 1); tick();

      registers.e = low;
      registers.d = high;
      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 12;
    },
  };
};

export { createPopDE };
