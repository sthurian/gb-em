import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type AdcAHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createAdcAHLIndirect = ({ mmu, registers }: AdcAHLIndirectDependencies) => {
  return {
    mnemonic: 'ADC A,(HL)',
    bytes: 1,
    execute: () => {
      const address = (registers.h << 8) | registers.l;
      const value = mmu.read8(address);
      const carry = (registers.f >> 4) & 1;
      const result = registers.a + value + carry;

      const zero = (result & 0xff) === 0;
      const halfCarry = ((registers.a & 0x0f) + (value & 0x0f) + carry) > 0x0f;
      const newCarry = result > 0xff;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        (halfCarry ? 0x20 : 0) |
        (newCarry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createAdcAHLIndirect };
