import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PushHLDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPushHL = ({ mmu, registers }: PushHLDependencies) => {
  return {
    mnemonic: 'PUSH HL',
    bytes: 1,
    execute: (tick = () => {}) => {
      tick(); // internal cycle before push
      registers.sp = (registers.sp - 2) & 0xffff;

      mmu.write8(registers.sp, registers.l); tick();
      mmu.write8(registers.sp + 1, registers.h); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 16;
    },
  };
};

export { createPushHL };