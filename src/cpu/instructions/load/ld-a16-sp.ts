import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdA16SpDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdA16Sp = ({ mmu, registers }: LdA16SpDependencies) => {
  return {
    mnemonic: 'LD (a16),SP',
    bytes: 3,
    execute: (tick = () => {}) => {
      const low = mmu.read8(registers.pc + 1); tick();
      const high = mmu.read8(registers.pc + 2); tick();
      const address = (high << 8) | low;

      mmu.write8(address, registers.sp & 0xff); tick();
      mmu.write8(address + 1, (registers.sp >> 8) & 0xff); tick();

      registers.pc = (registers.pc + 3) & 0xffff;

      return 20;
    },
  };
};

export { createLdA16Sp };
