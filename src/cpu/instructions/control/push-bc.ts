import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PushBCDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPushBC = ({ mmu, registers }: PushBCDependencies) => {
  return {
    mnemonic: 'PUSH BC',
    bytes: 1,
    execute: (tick = () => {}) => {
      tick(); // internal cycle before push
      registers.sp = (registers.sp - 2) & 0xffff;

      mmu.write8(registers.sp, registers.c); tick();
      mmu.write8(registers.sp + 1, registers.b); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 16;
    },
  };
};

export { createPushBC };