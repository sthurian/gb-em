import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type CallDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createCall = ({ mmu, registers }: CallDependencies) => {
  return {
    mnemonic: 'CALL a16',
    bytes: 3,
    execute: (tick = () => {}) => {
      const low = mmu.read8(registers.pc + 1); tick();
      const high = mmu.read8(registers.pc + 2); tick();
      const target = (high << 8) | low;
      const returnAddress = (registers.pc + 3) & 0xffff;

      tick(); // internal delay before push
      registers.sp = (registers.sp - 2) & 0xffff;
      mmu.write8(registers.sp, returnAddress & 0xff); tick();
      mmu.write8(registers.sp + 1, returnAddress >> 8); tick();

      registers.pc = target;

      return 24;
    },
  };
};

export { createCall };