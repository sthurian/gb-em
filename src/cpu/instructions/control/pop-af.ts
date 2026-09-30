import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PopAFDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPopAF = ({ mmu, registers }: PopAFDependencies) => {
  return {
    mnemonic: 'POP AF',
    bytes: 1,
    execute: () => {
      const flags = mmu.read8(registers.sp);
      const accumulator = mmu.read8((registers.sp + 1) & 0xffff);

      registers.f = flags & 0xf0;
      registers.a = accumulator;
      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (registers.pc + 1) & 0xffff;

      return 12;
    },
  };
};

export { createPopAF };