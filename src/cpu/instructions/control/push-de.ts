import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type PushDEDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createPushDE = ({ mmu, registers }: PushDEDependencies) => {
  return {
    mnemonic: 'PUSH DE',
    bytes: 1,
    execute: (tick = () => {}) => {
      tick(); // internal cycle before push
      registers.sp = (registers.sp - 2) & 0xffff;

      mmu.write8(registers.sp, registers.e); tick();
      mmu.write8(registers.sp + 1, registers.d); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 16;
    },
  };
};

export { createPushDE };
