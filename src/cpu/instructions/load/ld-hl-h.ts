import type { MMU } from '../../../mmu.js';
import type { Registers } from '../../cpu.js';

type LdHlHDependencies = {
  mmu: MMU;
  registers: Registers;
};

const createLdHLH = ({ mmu, registers }: LdHlHDependencies) => {
  return {
    mnemonic: 'LD (HL),H',
    bytes: 1,
    execute: (tick = () => {}) => {
      const address = (registers.h << 8) | registers.l;

      mmu.write8(address, registers.h); tick();

      registers.pc = (registers.pc + 1) & 0xffff;

      return 8;
    },
  };
};

export { createLdHLH };
