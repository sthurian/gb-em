import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type CallNzDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createCallNz = ({ mmu, registers }: CallNzDependencies) => {
  return {
    mnemonic: 'CALL NZ,a16',
    bytes: 3,
    execute: () => {
      const zero = (registers.f & 0x80) !== 0;

      if (zero) {
        registers.pc = (registers.pc + 3) & 0xffff;
        return 12;
      }

      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);
      const address = (high << 8) | low;
      const returnAddress = (registers.pc + 3) & 0xffff;

      registers.sp = (registers.sp - 2) & 0xffff;
      mmu.write8(registers.sp, returnAddress & 0xff);
      mmu.write8(registers.sp + 1, returnAddress >> 8);

      registers.pc = address;

      return 24;
    },
  };
};

export { createCallNz };