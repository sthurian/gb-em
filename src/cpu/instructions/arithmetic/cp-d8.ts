import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type CpD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createCpD8 = ({ mmu, registers }: CpD8Dependencies) => {
  return {
    mnemonic: 'CP d8',
    bytes: 2,
    execute: () => {
      const value = mmu.read8(registers.pc + 1);
      const result = registers.a - value;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (value & 0x0f);
      const carry = registers.a < value;

      registers.f =
        (zero ? 0x80 : 0) |
        0x40 |
        (halfCarry ? 0x20 : 0) |
        (carry ? 0x10 : 0);

      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createCpD8 };