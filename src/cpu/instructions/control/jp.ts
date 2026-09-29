import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type JpDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createJp = ({ mmu, registers }: JpDependencies) => {
  return {
    mnemonic: 'JP a16',
    bytes: 3,
    execute: () => {
      const low = mmu.read8(registers.pc + 1);
      const high = mmu.read8(registers.pc + 2);

      registers.pc = (high << 8) | low;

      return 16;
    },
  };
};

export { createJp };