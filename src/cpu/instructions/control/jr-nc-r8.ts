import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JrNcDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJrNcR8 = ({ mmu, registers }: JrNcDependencies) => {
  return {
    mnemonic: 'JR NC,r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const offset = mmu.read8(registers.pc + 1); tick();
      const carry = (registers.f & 0x10) !== 0;

      if (!carry) {
        const signedOffset = offset < 0x80 ? offset : offset - 0x100;
        registers.pc = (registers.pc + 2 + signedOffset) & 0xffff;
        tick(); // internal cycle after jump
      return 12;
      }

      registers.pc = (registers.pc + 2) & 0xffff;
      return 8;
    },
  };
};

export { createJrNcR8 };
