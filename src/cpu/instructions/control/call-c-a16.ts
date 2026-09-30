import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type CallCA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createCallCA16 = ({ mmu, registers }: CallCA16Dependencies) => {
  return {
    mnemonic: 'CALL C,a16',
    bytes: 3,
    execute: () => {
      const carry = (registers.f & 0x10) !== 0;

      if (!carry) {
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

export { createCallCA16 };
