import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type SubD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSubD8 = ({ mmu, registers }: SubD8Dependencies) => {
  return {
    mnemonic: 'SUB d8',
    bytes: 2,
    execute: () => {
      const value = mmu.read8(registers.pc + 1);
      const result = registers.a - value;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (value & 0x0f);
      const carry = registers.a < value;

      registers.a = result & 0xff;
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

export { createSubD8 };
