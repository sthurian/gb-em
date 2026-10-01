import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdBcD16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdBcD16 = ({ mmu, registers }: LdBcD16Dependencies) => {
  return {
    mnemonic: 'LD BC,d16',
    bytes: 3,
    execute: (tick = () => {}) => {
      const low = mmu.read8(registers.pc + 1); tick();
      const high = mmu.read8(registers.pc + 2); tick();

      registers.c = low;
      registers.b = high;
      registers.pc = (registers.pc + 3) & 0xffff;

      return 12;
    },
  };
};

export { createLdBcD16 };