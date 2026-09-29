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
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);
      const target = (high << 8) | low;
      const returnAddress = (registers.pc + 3) & 0xffff;

      registers.sp = (registers.sp - 2) & 0xffff;
      mmu.write8(registers.sp, returnAddress & 0xff);
      mmu.write8(registers.sp + 1, returnAddress >> 8);

      registers.pc = target;

      return 24;
    },
  };
};

export { createCall };