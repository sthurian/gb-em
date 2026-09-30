import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AddAD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAddAD8 = ({ mmu, registers }: AddAD8Dependencies) => {
  return {
    mnemonic: 'ADD A,d8',
    bytes: 2,
    execute: () => {
      const value = mmu.read8(registers.pc + 1);
      const result = registers.a + value;

      const zero = (result & 0xff) === 0;
      const halfCarry = ((registers.a & 0x0f) + (value & 0x0f)) > 0x0f;
      const carry = result > 0xff;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        (halfCarry ? 0x20 : 0) |
        (carry ? 0x10 : 0);

      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createAddAD8 };
