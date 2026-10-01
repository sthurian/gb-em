import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AddAHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAddAHLIndirect = ({ mmu, registers }: AddAHLIndirectDependencies) => {
  return {
    mnemonic: 'ADD A,(HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      const value = mmu.read8(address); tick();
      const result = registers.a + value;

      const zero = (result & 0xff) === 0;
      const halfCarry = ((registers.a & 0x0f) + (value & 0x0f)) > 0x0f;
      const carry = result > 0xff;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        (halfCarry ? 0x20 : 0) |
        (carry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createAddAHLIndirect };
