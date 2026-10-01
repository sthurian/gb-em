import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type SbcAHLIndirectDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createSbcAHLIndirect = ({ mmu, registers }: SbcAHLIndirectDependencies) => {
  return {
    mnemonic: 'SBC A,(HL)',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;
      const src = mmu.read8(address); tick();
      const carry = (registers.f >> 4) & 1;
      const result = registers.a - src - carry;

      const zero = (result & 0xff) === 0;
      const halfCarry = (registers.a & 0x0f) < (src & 0x0f) + carry;
      const newCarry = result < 0;

      registers.a = result & 0xff;
      registers.f =
        (zero ? 0x80 : 0) |
        0x40 |
        (halfCarry ? 0x20 : 0) |
        (newCarry ? 0x10 : 0);

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createSbcAHLIndirect };
