import { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type RetDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createRet = ({ mmu, registers }: RetDependencies) => {
  return {
    mnemonic: 'RET',
    bytes: 1,
    execute: (tick = () => {}) => {
      tick(); // internal cycle before pop
      const low = mmu.read8(registers.sp); tick();
      const high = mmu.read8(registers.sp + 1); tick();

      registers.sp = (registers.sp + 2) & 0xffff;
      registers.pc = (high << 8) | low;

      return 16;
    },
  };
};

export { createRet };