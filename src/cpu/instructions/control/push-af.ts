import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PushAFDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPushAF = ({ mmu, registers }: PushAFDependencies) => {
  return {
    mnemonic: 'PUSH AF',
    bytes: 1,
    execute: (tick = () => {}) => {
      tick(); // internal cycle before push
      registers.sp = (registers.sp - 2) & 0xffff;

      mmu.write8(registers.sp, registers.f & 0xf0); tick();
      mmu.write8(registers.sp + 1, registers.a); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 16;
    },
  };
};

export { createPushAF };