import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RetiDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createReti = ({ mmu, registers }: RetiDependencies) => {
  return {
    mnemonic: 'RETI',
    bytes: 1,
    execute: () => {
      const low = mmu.read8(registers.sp);
      const high = mmu.read8(registers.sp + 1);

      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (high << 8) | low;
      registers.ime = true;

      return 16;
    },
  };
};

export { createReti };
