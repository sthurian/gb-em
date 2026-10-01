import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JrNzDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJrNz = ({ mmu, registers }: JrNzDependencies) => {
  return {
    mnemonic: 'JR NZ,r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const offset = mmu.read8(registers.pc + 1); tick();
      const signedOffset = offset < 0x80 ? offset : offset - 0x100;
      const zero = (registers.f & 0x80) !== 0;

      if (!zero) {
        registers.pc = (registers.pc + 2 + signedOffset) & 0xffff;
        tick(); // internal cycle after jump
      return 12;
      }

      registers.pc = (registers.pc + 2) & 0xffff;
      return 8;
    },
  };
};

export { createJrNz };