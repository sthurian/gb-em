import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type CallZA16Dependencies = {
  mmu: MMU;
  registers: Registers;
};

const createCallZA16 = ({ mmu, registers }: CallZA16Dependencies) => {
  return {
    mnemonic: 'CALL Z,a16',
    bytes: 3,
    execute: (tick = () => {}) => {
      const zero = (registers.f & 0x80) !== 0;

      if (!zero) {
        tick(); tick(); // read operand bytes even when not taken
        registers.pc = (registers.pc + 3) & 0xffff;
        return 12;
      }

      const low = mmu.read8(registers.pc + 1); tick();
      const high = mmu.read8(registers.pc + 2); tick();
      const address = (high << 8) | low;
      const returnAddress = (registers.pc + 3) & 0xffff;

      tick(); // internal delay before push
      registers.sp = (registers.sp - 2) & 0xffff;
      mmu.write8(registers.sp, returnAddress & 0xff); tick();
      mmu.write8(registers.sp + 1, returnAddress >> 8); tick();

      registers.pc = address;

      return 24;
    },
  };
};

export { createCallZA16 };
