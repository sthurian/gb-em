import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RetNcDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRetNc = ({ mmu, registers }: RetNcDependencies) => {
  return {
    mnemonic: 'RET NC',
    bytes: 1,
    execute: (tick = () => {}) => {
      const carry = (registers.f & 0x10) !== 0;
      tick(); // condition check cycle

      if (carry) {
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

export { createRetNc };
