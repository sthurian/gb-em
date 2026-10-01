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
    execute: (tick = () => {}) => {
      const low = mmu.read8(registers.pc + 1); tick();
      const high = mmu.read8(registers.pc + 2); tick();

      registers.pc = (high << 8) | low;
      tick(); // internal cycle after jump

      return 16;
    },
  };
};

export { createJp };