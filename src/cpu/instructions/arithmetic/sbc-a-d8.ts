import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type SbcAD8Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSbcAD8 = ({ mmu, registers }: SbcAD8Dependencies) => {
  return {
    mnemonic: 'SBC A,d8',
    bytes: 2,
    execute: (tick = () => {}) => {
      const value = mmu.read8(registers.pc + 1); tick();
      const carry = (registers.f >> 4) & 1;
      const result = registers.a - value - carry;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (value & 0x0f) + carry;
      const newCarry = result < 0;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        0x40 |
        (halfCarry ? 0x20 : 0) |
        (newCarry ? 0x10 : 0);

      registers.pc = (registers.pc + 2) & 0xffff;

      return 8;
    },
  };
};

export { createSbcAD8 };
