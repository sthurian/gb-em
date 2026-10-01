import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AddSpR8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAddSpR8 = ({ mmu, registers }: AddSpR8Dependencies) => {
  return {
    mnemonic: 'ADD SP,r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const r8 = mmu.read8(registers.pc + 1); tick();
      const signedR8 = r8 >= 0x80 ? r8 - 256 : r8;
      const result = registers.sp + signedR8;

      const halfCarry = ((registers.sp ^ signedR8 ^ result) & 0x10) !== 0;
      const carry = ((registers.sp ^ signedR8 ^ result) & 0x100) !== 0;

      registers.sp = result & 0xffff;
      registers.f = (halfCarry ? 0x20 : 0) | (carry ? 0x10 : 0);

      tick(); tick(); // 2 internal cycles
      registers.pc = (registers.pc + 2) & 0xffff;

      return 16;
    },
  };
};

export { createAddSpR8 };
