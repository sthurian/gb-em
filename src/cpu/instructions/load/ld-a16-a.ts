import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdA16ADependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdA16A = ({ mmu, registers }: LdA16ADependencies) => {
  return {
    mnemonic: 'LD (a16),A',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);
      const address = (high << 8) | low;

      mmu.write8(address, registers.a);
      registers.pc = (registers.pc + 3) & 0xffff;

      return 16;
    },
  };
};

export { createLdA16A };