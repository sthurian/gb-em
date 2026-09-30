import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JrCDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJrCR8 = ({ mmu, registers }: JrCDependencies) => {
  return {
    mnemonic: 'JR C,r8',
    bytes: 2,
    execute: () => {
      const offset = mmu.read8(registers.pc + 1);
      const carry = (registers.f & 0x10) !== 0;

      if (carry) {
        const signedOffset = offset < 0x80 ? offset : offset - 0x100;
        registers.pc = (registers.pc + 2 + signedOffset) & 0xffff;
        return 12;
      }

      registers.pc = (registers.pc + 2) & 0xffff;
      return 8;
    },
  };
};

export { createJrCR8 };
