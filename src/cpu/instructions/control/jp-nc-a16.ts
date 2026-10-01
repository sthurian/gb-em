import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JpNcA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJpNcA16 = ({ mmu, registers }: JpNcA16Dependencies) => {
  return {
    mnemonic: 'JP NC,a16',
    bytes: 3,
    execute: (tick = () => {}) => {
      const carry = (registers.f & 0x10) !== 0;

      if (!carry) {
        const low = mmu.read8(registers.pc + 1); tick();
        const high = mmu.read8(registers.pc + 2); tick();
        registers.pc = (high << 8) | low;
        tick(); // internal cycle after jump
        return 16;
      }

      tick(); tick(); // read operand bytes even when not taken
      registers.pc = (registers.pc + 3) & 0xffff;
      return 12;
    },
  };
};

export { createJpNcA16 };
