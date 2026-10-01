import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHLSpR8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLSpR8 = ({ mmu, registers }: LdHLSpR8Dependencies) => {
  return {
    mnemonic: 'LD HL,SP+r8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const r8 = mmu.read8(registers.pc + 1); tick();
      const signedR8 = r8 >= 0x80 ? r8 - 256 : r8;
      const result = registers.sp + signedR8;

      const halfCarry = ((registers.sp ^ signedR8 ^ result) & 0x10) !== 0;
      const carry = ((registers.sp ^ signedR8 ^ result) & 0x100) !== 0;

      const newHl = result & 0xffff;
      registers.h = newHl >> 8;
      registers.l = newHl & 0xff;

      registers.f = (halfCarry ? 0x20 : 0) | (carry ? 0x10 : 0);

      tick(); // internal cycle
      registers.pc = (registers.pc + 2) & 0xffff;

      return 12;
    },
  };
};

export { createLdHLSpR8 };
