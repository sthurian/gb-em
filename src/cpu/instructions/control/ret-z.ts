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
    execute: (tick = () => {}) => {
      const zero = (registers.f & 0x80) !== 0;
      tick(); // condition check cycle

      if (!zero) {
        registers.pc = (registers.pc + 1) & 0xffff;
        return 8;
      }

      tick(); // internal cycle before pop


      const low = mmu.read8(registers.sp); tick();
      const high = mmu.read8(registers.sp + 1); tick();

      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (high << 8) | low;

      return 20;
    },
  };
};

export { createRetZ };
